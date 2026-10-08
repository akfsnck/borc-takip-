'use client';

import React from 'react';
import { CalculatedDebtStatus } from '@/lib/types';
import { formatCurrency, formatDateTR } from '@/lib/calculations';
import { AlertCircle, Clock, Calendar, Banknote, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface UrgentPaymentsProps {
  debts: CalculatedDebtStatus[];
  onPayDebt: (debtId: string) => void;
}

export const UrgentPayments: React.FC<UrgentPaymentsProps> = ({
  debts,
  onPayDebt,
}) => {
  // Sadece henüz ödenmemiş veya asgari tutarı kalmış borçlar
  const unpaidDebts = debts.filter(d => d.remainingStatementBalance > 0);

  // Sıralama mantığı:
  // 1. Gecikmiş
  // 2. Kalan gün küçükten büyüğe
  // 3. Risk skoru
  const sorted = [...unpaidDebts].sort((a, b) => {
    if (a.isOverdue && !b.isOverdue) return -1;
    if (!a.isOverdue && b.isOverdue) return 1;

    const daysA = a.daysUntilDue ?? 999;
    const daysB = b.daysUntilDue ?? 999;
    if (daysA !== daysB) return daysA - daysB;

    return b.riskScore - a.riskScore;
  });

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              ACİL ÖDEMELER
            </h3>
            <p className="text-[11px] text-slate-500">Ödeme Vadesine Göre Sıralı</p>
          </div>
        </div>
        <span className="text-xs text-slate-400">
          {sorted.length} Kalem
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
        {sorted.map((item) => {
          const { debt, statusBadge, riskColor, daysUntilDue, isOverdue, overdueDays } = item;

          const isRed = riskColor === 'red';
          const isOrange = riskColor === 'orange';

          return (
            <div
              key={debt.id}
              className={`rounded-2xl p-4 border transition-all flex flex-col justify-between ${
                isRed
                  ? 'bg-gradient-to-br from-rose-950/30 to-slate-900 border-rose-500/40 shadow-lg shadow-rose-950/20'
                  : isOrange
                  ? 'bg-gradient-to-br from-amber-950/20 to-slate-900 border-amber-500/30'
                  : 'bg-slate-900/90 border-slate-800'
              }`}
            >
              <div>
                {/* Banka & Durum Rozeti */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-semibold text-slate-400 uppercase">
                        {debt.bank}
                      </span>
                      {debt.last_four && (
                        <span className="text-[10px] text-slate-400 font-mono bg-slate-800 px-1 py-0.2 rounded border border-slate-700">
                          •••• {debt.last_four}
                        </span>
                      )}
                    </div>
                    <h4 className="text-sm font-bold text-white tracking-tight mt-0.5">
                      {debt.name}
                    </h4>
                  </div>

                  {/* Rozet */}
                  <div className="text-right">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border inline-flex items-center gap-1 ${
                      isRed
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                        : isOrange
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        : 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}>
                      {isOverdue && <ShieldAlert className="w-3 h-3 text-rose-400" />}
                      {statusBadge.text}
                    </span>
                  </div>
                </div>

                {/* Tutarlar & Vade */}
                <div className="grid grid-cols-2 gap-2 py-2 border-y border-slate-800/80 text-xs my-2">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Kalan Ekstre:</span>
                    <span className="text-sm font-bold text-white">
                      {formatCurrency(item.remainingStatementBalance)}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[11px]">Kalan Asgari:</span>
                    <span className={`text-sm font-bold ${
                      item.remainingMinimumPayment > 0 ? 'text-amber-400' : 'text-emerald-400'
                    }`}>
                      {item.remainingMinimumPayment > 0
                        ? formatCurrency(item.remainingMinimumPayment)
                        : 'Ödendi ✓'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Alt Kısım: Tarih ve Öde Butonu */}
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-1.5 text-xs">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-slate-300 font-medium">
                    {formatDateTR(debt.due_date || debt.first_due_date)}
                  </span>
                  <span className={`font-bold ml-1 ${
                    isOverdue ? 'text-rose-400' : daysUntilDue !== null && daysUntilDue <= 3 ? 'text-amber-400' : 'text-slate-400'
                  }`}>
                    ({isOverdue ? `${overdueDays} gün gecikti` : daysUntilDue === 0 ? 'Bugün' : `${daysUntilDue} gün kaldı`})
                  </span>
                </div>

                <button
                  onClick={() => onPayDebt(debt.id)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-md active:scale-95 ${
                    isRed
                      ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
                  }`}
                >
                  <Banknote className="w-3.5 h-3.5" />
                  <span>Öde</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
