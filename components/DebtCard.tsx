'use client';

import React from 'react';
import { CalculatedDebtStatus } from '@/lib/types';
import { formatCurrency, formatDateTR, formatPercent } from '@/lib/calculations';
import { getBankTheme } from '@/lib/bankColors';
import { AlertCircle, Calendar, CreditCard, Landmark, CheckCircle2, ChevronRight, Banknote, ShieldAlert } from 'lucide-react';

interface DebtCardProps {
  status: CalculatedDebtStatus;
  onPayClick: () => void;
  onHistoryClick: () => void;
}

export const DebtCard: React.FC<DebtCardProps> = ({
  status,
  onPayClick,
  onHistoryClick,
}) => {
  const { debt, statusBadge, riskColor, utilizationRate, totalPaidThisCycle } = status;

  // Renk stilleri
  const getBorderColor = () => {
    if (riskColor === 'red') return 'border-rose-500/40 bg-gradient-to-b from-rose-950/20 to-slate-900/80';
    if (riskColor === 'orange') return 'border-amber-500/40 bg-gradient-to-b from-amber-950/20 to-slate-900/80';
    if (riskColor === 'yellow') return 'border-yellow-500/40 bg-gradient-to-b from-yellow-950/20 to-slate-900/80';
    return 'border-slate-800 bg-slate-900/80';
  };

  const getBadgeClass = () => {
    switch (statusBadge.color) {
      case 'red':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      case 'orange':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'yellow':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40';
      case 'green':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  // İlerleme çubuğu rengi
  const getProgressBarColor = () => {
    if (utilizationRate >= 90) return 'bg-rose-500';
    if (utilizationRate >= 70) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  const isTaksitli = debt.total_installments && debt.total_installments > 0;
  const isKMH = debt.type === 'overdraft';
  const bankTheme = getBankTheme(debt.bank);

  return (
    <div className={`rounded-2xl border p-4.5 transition-all shadow-lg hover:shadow-xl relative overflow-hidden ${getBorderColor()}`}>
      {/* Banka Özel Renkli Üst Çizgi (Accent Stripe) */}
      <div
        className="absolute top-0 left-0 right-0 h-1.5"
        style={{
          background: `linear-gradient(90deg, ${bankTheme.primary}, ${bankTheme.secondary || bankTheme.primary})`,
        }}
      />

      {/* Arka plan köşe ışıltısı */}
      <div
        className="absolute -top-10 -right-10 w-28 h-28 rounded-full blur-2xl pointer-events-none opacity-40"
        style={{ background: bankTheme.glowColor }}
      />

      {/* Üst Kısım: Banka, Ürün ve Rozet */}
      <div className="flex items-start justify-between gap-3 mb-3 pt-1">
        <div className="flex items-center gap-2.5">
          {/* Banka Özel Renkli İkon Kutusu */}
          <div
            className="p-2.5 rounded-xl border flex items-center justify-center text-white shadow-md shrink-0"
            style={{
              background: `linear-gradient(135deg, ${bankTheme.primary}, ${bankTheme.secondary})`,
              borderColor: 'rgba(255, 255, 255, 0.15)',
            }}
          >
            {isKMH ? (
              <Landmark className="w-5 h-5 text-white" />
            ) : (
              <CreditCard className="w-5 h-5 text-white" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span
                className={`text-[11px] font-bold px-2 py-0.5 rounded-md border uppercase tracking-wider ${bankTheme.badgeBg} ${bankTheme.badgeText} ${bankTheme.badgeBorder}`}
              >
                {debt.bank}
              </span>
              {debt.last_four && (
                <span className="text-xs text-slate-400 font-mono bg-slate-800/80 px-1.5 py-0.5 rounded border border-slate-700/60">
                  •••• {debt.last_four}
                </span>
              )}
            </div>
            <h3 className="text-sm sm:text-base font-bold text-white tracking-tight mt-1">
              {debt.name}
            </h3>
          </div>
        </div>

        {/* Durum Rozeti */}
        <div className="flex flex-col items-end">
          <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${getBadgeClass()} flex items-center gap-1`}>
            {riskColor === 'red' && <ShieldAlert className="w-3 h-3" />}
            {statusBadge.text}
          </span>
          {statusBadge.subtext && (
            <span className="text-[10px] text-slate-400 mt-1">
              {statusBadge.subtext}
            </span>
          )}
        </div>
      </div>

      {/* Taksit Durumu Progress Bar (Varsa) */}
      {isTaksitli && (
        <div className="mb-3.5 bg-slate-800/50 p-2.5 rounded-xl border border-slate-800">
          <div className="flex justify-between text-xs text-slate-300 mb-1 font-medium">
            <span>Taksit İlerlemesi:</span>
            <span className="text-emerald-400 font-bold">
              {debt.paid_installments ?? 0} / {debt.total_installments} Taksit
            </span>
          </div>
          <div className="w-full bg-slate-700/60 rounded-full h-2 overflow-hidden">
            <div
              className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(100, (((debt.paid_installments ?? 0) / (debt.total_installments || 1)) * 100))}%`,
              }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-slate-400 mt-1">
            <span>Aylık: {formatCurrency(debt.monthly_installment)}</span>
            <span>Kalan: {debt.remaining_installments} taksit</span>
          </div>
        </div>
      )}

      {/* Limit Kullanım Çubuğu (Kredi kartı & KMH) */}
      {!isTaksitli && (debt.credit_limit || debt.overdraft_limit) && (
        <div className="mb-3.5 bg-slate-800/40 p-2.5 rounded-xl border border-slate-800/80">
          <div className="flex justify-between items-center text-xs mb-1">
            <span className="text-slate-400">
              {isKMH ? 'KMH Limit Kullanımı:' : 'Kart Limit Kullanımı:'}
            </span>
            <span className={`font-bold ${
              utilizationRate >= 90 ? 'text-rose-400' : utilizationRate >= 70 ? 'text-amber-400' : 'text-emerald-400'
            }`}>
              {formatPercent(utilizationRate)}
            </span>
          </div>
          <div className="w-full bg-slate-700/60 rounded-full h-2 overflow-hidden">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${getProgressBarColor()}`}
              style={{ width: `${Math.min(100, utilizationRate)}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-slate-400 mt-1.5">
            <span>Limit: {formatCurrency(debt.credit_limit || debt.overdraft_limit)}</span>
            <span>
              Kullanılabilir: {formatCurrency(status.effectiveAvailableLimit)}
            </span>
          </div>
        </div>
      )}

      {/* Kısmi Ödeme Bilgilendirmesi (Kullanıcı bu ay ödeme yaptıysa) */}
      {totalPaidThisCycle > 0 && (
        <div className="mb-3 bg-emerald-950/30 border border-emerald-500/30 rounded-xl p-2.5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
            <CheckCircle2 className="w-4 h-4" />
            <span>Bu dönem ödenen: <strong>{formatCurrency(totalPaidThisCycle)}</strong></span>
          </div>
          <button
            onClick={onHistoryClick}
            className="text-[11px] text-emerald-300 underline hover:text-emerald-200"
          >
            Geçmişi Gör
          </button>
        </div>
      )}

      {/* Borç Tutarları Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 py-2 border-t border-slate-800/80 text-xs">
        <div>
          <span className="text-slate-400 block text-[11px]">
            {isTaksitli ? 'Kalan Toplam Borç' : 'Kalan Ekstre Borcu'}
          </span>
          <span className="text-sm font-bold text-white">
            {formatCurrency(
              isTaksitli
                ? status.effectiveCurrentBalance
                : status.remainingStatementBalance
            )}
          </span>
        </div>

        <div>
          <span className="text-slate-400 block text-[11px]">
            {isTaksitli ? 'Aylık Taksit' : 'Kalan Asgari Tutar'}
          </span>
          <span className={`text-sm font-bold ${
            status.remainingMinimumPayment > 0 ? 'text-amber-400' : 'text-emerald-400'
          }`}>
            {status.remainingMinimumPayment > 0
              ? formatCurrency(status.remainingMinimumPayment)
              : 'Ödendi ✓'}
          </span>
        </div>

        <div className="col-span-2 sm:col-span-1">
          <span className="text-slate-400 block text-[11px]">Son Ödeme Tarihi</span>
          <div className="flex items-center gap-1 text-sm font-bold text-slate-200">
            <Calendar className="w-3.5 h-3.5 text-emerald-400" />
            <span>{formatDateTR(debt.due_date || debt.first_due_date)}</span>
          </div>
        </div>
      </div>

      {/* Alt Not ve Hızlı Aksiyon */}
      {debt.note && (
        <p className="text-[11px] text-slate-400 italic mt-1 line-clamp-1 border-t border-slate-800/40 pt-1.5">
          💬 {debt.note}
        </p>
      )}

      {/* Aksiyon Butonları */}
      <div className="mt-3.5 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
        <button
          onClick={onHistoryClick}
          className="text-xs text-slate-400 hover:text-slate-200 px-2 py-1.5 rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-1"
        >
          <span>Ödeme Geçmişi</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={onPayClick}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-md shadow-emerald-600/20 active:scale-95 transition-all"
        >
          <Banknote className="w-4 h-4" />
          <span>Ödeme Yap</span>
        </button>
      </div>
    </div>
  );
};
