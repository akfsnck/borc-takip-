'use client';

import React from 'react';
import { FinancialHealthMetrics, CalculatedDebtStatus } from '@/lib/types';
import { formatCurrency, formatPercent, formatDateTR } from '@/lib/calculations';
import { 
  Activity, 
  AlertTriangle, 
  ShieldAlert, 
  ShieldCheck, 
  TrendingUp, 
  CalendarRange, 
  CheckCircle,
  HelpCircle,
  Sparkles
} from 'lucide-react';

interface FinancialHealthProps {
  metrics: FinancialHealthMetrics;
  calculatedDebts: CalculatedDebtStatus[];
  onPayDebt: (debtId: string) => void;
}

export const FinancialHealth: React.FC<FinancialHealthProps> = ({
  metrics,
  calculatedDebts,
  onPayDebt,
}) => {
  const { behaviorScores } = metrics;

  const getBehaviorBadge = (status: 'good' | 'warning' | 'risk') => {
    switch (status) {
      case 'risk':
        return { text: 'RİSKLİ', bg: 'bg-rose-500/20 text-rose-300 border-rose-500/40' };
      case 'warning':
        return { text: 'DİKKAT', bg: 'bg-amber-500/20 text-amber-300 border-amber-500/40' };
      case 'good':
        return { text: 'İYİ', bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' };
    }
  };

  return (
    <div className="space-y-6">
      {/* Başlık ve Skor Özeti */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-950 p-5 rounded-2xl border border-slate-800 relative overflow-hidden">
        <div className="flex items-center gap-2.5 mb-2">
          <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
              FİNANSAL SAĞLIK VE KREDİ SKORU GÖSTERGELERİ
            </h2>
            <p className="text-xs text-slate-400">
              Finansal davranış analizi ve kredi notunu baskılayan kritik faktörler
            </p>
          </div>
        </div>

        {/* Skor Notu */}
        <p className="text-xs text-slate-400 mt-2 bg-slate-800/40 p-3 rounded-xl border border-slate-700/60">
          💡 <strong>Not:</strong> Bu ekran bankalardan bağımsız bir <em>davranışsal sağlık simülasyonudur</em>. Findeks / KKB notunuzu doğrudan etkileyen faktörler; gecikmeler, limit doluluk oranları ve asgari ödeme disiplinidir.
        </p>
      </div>

      {/* Finansal Sağlık Sayıcı Kartları */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
        {/* Gecikmiş Ödeme Sayısı */}
        <div className={`p-3.5 rounded-xl border ${
          metrics.overdueCount > 0 ? 'bg-rose-950/30 border-rose-500/40' : 'bg-slate-900/60 border-slate-800'
        }`}>
          <span className="text-[11px] text-slate-400 block mb-1">Gecikmiş Ödeme</span>
          <div className="flex items-baseline gap-1.5">
            <span className={`text-xl font-black ${metrics.overdueCount > 0 ? 'text-rose-400' : 'text-slate-300'}`}>
              {metrics.overdueCount}
            </span>
            <span className="text-xs font-bold text-rose-500">🔴</span>
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">Acil kapatılmalı</span>
        </div>

        {/* Limit Aşan Kart Sayısı */}
        <div className={`p-3.5 rounded-xl border ${
          metrics.limitExceededCount > 0 ? 'bg-rose-950/30 border-rose-500/40' : 'bg-slate-900/60 border-slate-800'
        }`}>
          <span className="text-[11px] text-slate-400 block mb-1">Limit Aşan Kart</span>
          <div className="flex items-baseline gap-1.5">
            <span className={`text-xl font-black ${metrics.limitExceededCount > 0 ? 'text-rose-400' : 'text-slate-300'}`}>
              {metrics.limitExceededCount}
            </span>
            <span className="text-xs font-bold text-rose-500">🔴</span>
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">Faiz & limit aşım riski</span>
        </div>

        {/* %90 Üzeri Kart Sayısı */}
        <div className={`p-3.5 rounded-xl border ${
          metrics.over90PercentCardsCount > 0 ? 'bg-rose-950/30 border-rose-500/40' : 'bg-slate-900/60 border-slate-800'
        }`}>
          <span className="text-[11px] text-slate-400 block mb-1">%90+ Dolu Kart</span>
          <div className="flex items-baseline gap-1.5">
            <span className={`text-xl font-black ${metrics.over90PercentCardsCount > 0 ? 'text-rose-400' : 'text-slate-300'}`}>
              {metrics.over90PercentCardsCount}
            </span>
            <span className="text-xs font-bold text-rose-500">🔴</span>
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">Skor baskılayıcı</span>
        </div>

        {/* %70-90 Kart Sayısı */}
        <div className="p-3.5 rounded-xl border bg-slate-900/60 border-slate-800">
          <span className="text-[11px] text-slate-400 block mb-1">%70-90 Dolu Kart</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-black text-amber-400">
              {metrics.over70PercentCardsCount}
            </span>
            <span className="text-xs font-bold text-amber-500">🟠</span>
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">Dikkat bandında</span>
        </div>

        {/* %90 Üzeri KMH Sayısı */}
        <div className={`p-3.5 rounded-xl border ${
          metrics.over90PercentKMHCount > 0 ? 'bg-rose-950/30 border-rose-500/40' : 'bg-slate-900/60 border-slate-800'
        }`}>
          <span className="text-[11px] text-slate-400 block mb-1">%90+ Dolu KMH</span>
          <div className="flex items-baseline gap-1.5">
            <span className={`text-xl font-black ${metrics.over90PercentKMHCount > 0 ? 'text-rose-400' : 'text-slate-300'}`}>
              {metrics.over90PercentKMHCount}
            </span>
            <span className="text-xs font-bold text-rose-500">🔴</span>
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">Bileşik faiz yükü</span>
        </div>
      </div>

      {/* RİSKLER BÖLÜMÜ (Mevcut Başlangıç Verileri Durumu) */}
      <div className="bg-slate-900/80 rounded-2xl p-4 sm:p-5 border border-slate-800 space-y-3">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-rose-400" />
          <h3 className="text-sm font-bold text-white tracking-wide uppercase">
            AKTİF TESPİT EDİLEN RİSKLER
          </h3>
        </div>

        <div className="space-y-2 text-xs">
          {calculatedDebts.filter(d => d.isOverdue).map(d => (
            <div key={d.debt.id} className="p-3 bg-rose-950/20 border border-rose-500/30 rounded-xl flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-rose-400 font-bold">🔴 Gecikmiş Borç:</span>
                <span className="text-slate-200">
                  {d.debt.name} ({formatDateTR(d.debt.due_date)} vadeli, {d.overdueDays} gün gecikti). Kalan: {formatCurrency(d.remainingStatementBalance)}
                </span>
              </div>
              <button
                onClick={() => onPayDebt(d.debt.id)}
                className="px-2.5 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded-lg font-bold shrink-0 text-[11px]"
              >
                Hemen Öde
              </button>
            </div>
          ))}

          {calculatedDebts.filter(d => d.isLimitExceeded).map(d => (
            <div key={d.debt.id} className="p-3 bg-rose-950/20 border border-rose-500/30 rounded-xl flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-rose-400 font-bold">🔴 Limit Aşımı:</span>
                <span className="text-slate-200">
                  {d.debt.name} kartında limit {formatCurrency(d.limitExceededAmount)} aşıldı.
                </span>
              </div>
              <button
                onClick={() => onPayDebt(d.debt.id)}
                className="px-2.5 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded-lg font-bold shrink-0 text-[11px]"
              >
                Limiti Düzelt
              </button>
            </div>
          ))}

          {calculatedDebts.filter(d => d.debt.type === 'overdraft' && d.utilizationRate >= 99).map(d => (
            <div key={d.debt.id} className="p-3 bg-rose-950/20 border border-rose-500/30 rounded-xl flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-rose-400 font-bold">🔴 KMH %100 Kullanım:</span>
                <span className="text-slate-200">
                  {d.debt.name} limiti ({formatCurrency(d.debt.overdraft_limit)}) tamamen tükenmiş durumda.
                </span>
              </div>
              <button
                onClick={() => onPayDebt(d.debt.id)}
                className="px-2.5 py-1 bg-amber-600 hover:bg-amber-500 text-white rounded-lg font-bold shrink-0 text-[11px]"
              >
                Bakiye Yatır
              </button>
            </div>
          ))}

          {calculatedDebts.filter(d => d.debt.type === 'credit_card' && d.utilizationRate >= 90 && !d.isLimitExceeded).map(d => (
            <div key={d.debt.id} className="p-3 bg-rose-950/20 border border-rose-500/30 rounded-xl flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-rose-400 font-bold">🔴 Kritik Kart Doluluğu:</span>
                <span className="text-slate-200">
                  {d.debt.name} limitinin {formatPercent(d.utilizationRate)}'i kullanılıyor ({formatCurrency(d.effectiveCurrentBalance)}).
                </span>
              </div>
              <button
                onClick={() => onPayDebt(d.debt.id)}
                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold shrink-0 text-[11px]"
              >
                Kısmi Öde
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 30 / 60 / 90 GÜNLÜK NAKİT AKIŞI YÜKÜ (Bölüm 13) */}
      <div className="bg-slate-900/80 rounded-2xl p-4 sm:p-5 border border-slate-800 space-y-4">
        <div className="flex items-center gap-2">
          <CalendarRange className="w-5 h-5 text-teal-400" />
          <h3 className="text-sm font-bold text-white tracking-wide uppercase">
            30 / 60 / 90 GÜNLÜK NAKİT AKIŞI PROJEKSİYONU
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <span className="text-[11px] text-slate-400 block mb-1">Önümüzdeki 7 Gün</span>
            <span className="text-sm sm:text-base font-bold text-amber-400">
              {formatCurrency(metrics.next7DaysTotal)}
            </span>
          </div>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <span className="text-[11px] text-slate-400 block mb-1">Önümüzdeki 30 Gün</span>
            <span className="text-sm sm:text-base font-bold text-emerald-400">
              {formatCurrency(metrics.next30DaysTotal)}
            </span>
          </div>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <span className="text-[11px] text-slate-400 block mb-1">Önümüzdeki 60 Gün</span>
            <span className="text-sm sm:text-base font-bold text-cyan-400">
              {formatCurrency(metrics.next60DaysTotal)}
            </span>
          </div>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <span className="text-[11px] text-slate-400 block mb-1">Önümüzdeki 90 Gün</span>
            <span className="text-sm sm:text-base font-bold text-indigo-400">
              {formatCurrency(metrics.next90DaysTotal)}
            </span>
          </div>
        </div>
      </div>

      {/* KREDİ NOTU DAVRANIŞ DESTEK TABLOSU (Bölüm 15) */}
      <div className="bg-slate-900/80 rounded-2xl p-4 sm:p-5 border border-slate-800 space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <h3 className="text-sm font-bold text-white tracking-wide uppercase">
            KREDİ NOTU DAVRANIŞSAL DEĞERLENDİRME
          </h3>
        </div>

        <div className="space-y-2.5">
          {/* Ödeme Düzeni */}
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-xs font-bold text-white">Ödeme Düzeni & Gecikmeler</span>
              <p className="text-[11px] text-slate-400 mt-0.5">{behaviorScores.paymentDisciplineReason}</p>
            </div>
            <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border self-start sm:self-center ${getBehaviorBadge(behaviorScores.paymentDiscipline).bg}`}>
              {getBehaviorBadge(behaviorScores.paymentDiscipline).text}
            </span>
          </div>

          {/* Limit Kullanımı */}
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-xs font-bold text-white">Limit Doluluk Oranı</span>
              <p className="text-[11px] text-slate-400 mt-0.5">{behaviorScores.limitUtilizationReason}</p>
            </div>
            <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border self-start sm:self-center ${getBehaviorBadge(behaviorScores.limitUtilization).bg}`}>
              {getBehaviorBadge(behaviorScores.limitUtilization).text}
            </span>
          </div>

          {/* KMH Kullanımı */}
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-xs font-bold text-white">KMH / Esnek Hesap Durumu</span>
              <p className="text-[11px] text-slate-400 mt-0.5">{behaviorScores.overdraftHealthReason}</p>
            </div>
            <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border self-start sm:self-center ${getBehaviorBadge(behaviorScores.overdraftHealth).bg}`}>
              {getBehaviorBadge(behaviorScores.overdraftHealth).text}
            </span>
          </div>

          {/* Limit Aşımı */}
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-xs font-bold text-white">Limit Aşımı Kontrolü</span>
              <p className="text-[11px] text-slate-400 mt-0.5">{behaviorScores.limitExcessHealthReason}</p>
            </div>
            <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border self-start sm:self-center ${getBehaviorBadge(behaviorScores.limitExcessHealth).bg}`}>
              {getBehaviorBadge(behaviorScores.limitExcessHealth).text}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
