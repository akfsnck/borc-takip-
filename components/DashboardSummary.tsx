'use client';

import React from 'react';
import { FinancialHealthMetrics } from '@/lib/types';
import { formatCurrency } from '@/lib/calculations';
import { AlertCircle, Clock, ShieldAlert, TrendingDown, Wallet } from 'lucide-react';

interface DashboardSummaryProps {
  metrics: FinancialHealthMetrics;
  onNavigateToOverdue: () => void;
}

export const DashboardSummary: React.FC<DashboardSummaryProps> = ({
  metrics,
  onNavigateToOverdue,
}) => {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-gradient-to-br dark:from-slate-900 dark:via-slate-900/95 dark:to-slate-950 border border-slate-200/90 dark:border-slate-800 p-5 shadow-lg dark:shadow-2xl">
      {/* Arka plan parlama efekti */}
      <div className="absolute -right-16 -top-16 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-16 -bottom-16 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Başlık & Güvenlik Rozeti */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-emerald-500/15 border border-emerald-500/25 text-emerald-600 dark:text-emerald-400">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              FİNANSAL DURUM
            </h2>
            <p className="text-xs text-slate-400 dark:text-slate-500">Konsolide Borç Özeti</p>
          </div>
        </div>

        {metrics.overdueCount > 0 ? (
          <button
            onClick={onNavigateToOverdue}
            className="flex items-center gap-1.5 px-3 py-1 bg-rose-500/15 border border-rose-500/40 rounded-full text-rose-600 dark:text-rose-400 text-xs font-semibold animate-pulse"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>{metrics.overdueCount} Gecikmiş Borç</span>
          </button>
        ) : (
          <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-xs font-medium bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
            ✓ Gecikme Yok
          </span>
        )}
      </div>

      {/* Büyük Tutar: Toplam Borç */}
      <div className="mb-6">
        <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1">Toplam Konsolide Borç</span>
        <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-baseline gap-2">
          {formatCurrency(metrics.totalDebt)}
        </div>
      </div>

      {/* Grid İstatistik Kartları */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-4 border-t border-slate-100 dark:border-slate-800/80">
        {/* Bu Ay Ödenecek */}
        <div className="bg-slate-50 dark:bg-slate-800/40 rounded-xl p-3 border border-slate-200/80 dark:border-slate-800">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1">Bu Ay Ödenecek</span>
          <span className="text-sm sm:text-base font-bold text-emerald-600 dark:text-emerald-400">
            {formatCurrency(metrics.thisMonthTotalToPay)}
          </span>
        </div>

        {/* Önümüzdeki 7 Gün */}
        <div className="bg-slate-50 dark:bg-slate-800/40 rounded-xl p-3 border border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 mb-1">
            <Clock className="w-3 h-3 text-amber-500 dark:text-amber-400" />
            <span>Önümüzdeki 7 Gün</span>
          </div>
          <span className="text-sm sm:text-base font-bold text-amber-600 dark:text-amber-400">
            {formatCurrency(metrics.next7DaysTotal)}
          </span>
        </div>

        {/* Gecikmiş */}
        <div className={`rounded-xl p-3 border ${
          metrics.overdueCount > 0
            ? 'bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/30'
            : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-800'
        }`}>
          <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 mb-1">
            <AlertCircle className={`w-3 h-3 ${metrics.overdueCount > 0 ? 'text-rose-500 dark:text-rose-400' : 'text-slate-400'}`} />
            <span>Gecikmiş</span>
          </div>
          <span className={`text-sm sm:text-base font-bold ${
            metrics.overdueCount > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-700 dark:text-slate-300'
          }`}>
            {metrics.overdueCount > 0 ? `${metrics.overdueCount} Kalem` : '0 (Temiz)'}
          </span>
        </div>

        {/* Asgari Ödeme Toplamı */}
        <div className="bg-slate-50 dark:bg-slate-800/40 rounded-xl p-3 border border-slate-200/80 dark:border-slate-800">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1">Asgari Ödeme Toplamı</span>
          <span className="text-sm sm:text-base font-bold text-cyan-600 dark:text-cyan-400">
            {formatCurrency(metrics.thisMonthMinimumTotal)}
          </span>
        </div>
      </div>
    </div>
  );
};
