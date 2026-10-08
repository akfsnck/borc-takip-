'use client';

import React from 'react';
import { FinancialHealthMetrics, Debt } from '@/lib/types';
import { formatCurrency } from '@/lib/calculations';
import { AlertTriangle, CheckCircle2, Flame, ArrowRight, Banknote } from 'lucide-react';

interface TodayActionsProps {
  metrics: FinancialHealthMetrics;
  onPayDebt: (debtId: string) => void;
}

export const TodayActions: React.FC<TodayActionsProps> = ({
  metrics,
  onPayDebt,
}) => {
  const items = metrics.topActionItems;

  if (items.length === 0) {
    return (
      <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 flex items-center gap-3">
        <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
        <div>
          <h3 className="text-sm font-semibold text-emerald-300">Tebrikler! Acil bir risk bulunmuyor.</h3>
          <p className="text-xs text-slate-400">Tüm acil ödemeler ve limitler kontrol altında.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Flame className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              BUGÜN NE YAPMALIYIM?
            </h3>
            <p className="text-[11px] text-slate-500">Öncelik Motoru Tarafından Sıralandı</p>
          </div>
        </div>
        <span className="text-[11px] font-medium text-slate-400">
          {items.length} Önemli Görev
        </span>
      </div>

      <div className="space-y-2">
        {items.map((item, index) => {
          const isCritical = item.severity === 'critical';
          return (
            <div
              key={item.id}
              className={`rounded-xl p-3.5 border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                isCritical
                  ? 'bg-rose-950/20 border-rose-500/30 hover:border-rose-500/50'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                  isCritical
                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                    : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                }`}>
                  {index + 1}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    {item.title}
                    {isCritical && (
                      <span className="text-[10px] bg-rose-500/20 text-rose-400 border border-rose-500/30 px-1.5 py-0.2 rounded font-semibold">
                        KRİTİK
                      </span>
                    )}
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Hızlı Aksiyon */}
              {item.debtId && (
                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <button
                    onClick={() => onPayDebt(item.debtId!)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-all active:scale-95 ${
                      isCritical
                        ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/20'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20'
                    }`}
                  >
                    <Banknote className="w-3.5 h-3.5" />
                    <span>Ödeme Yap</span>
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
