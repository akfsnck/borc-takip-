'use client';

import React from 'react';
import { PaymentRecord, Debt } from '@/lib/types';
import { formatCurrency, formatDateTR } from '@/lib/calculations';
import { X, Receipt, Trash2, CheckCircle2 } from 'lucide-react';

interface PaymentHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  payments: PaymentRecord[];
  debts: Debt[];
  selectedDebtId?: string | null;
  onDeletePayment: (paymentId: string) => void;
}

export const PaymentHistoryModal: React.FC<PaymentHistoryModalProps> = ({
  isOpen,
  onClose,
  payments,
  debts,
  selectedDebtId,
  onDeletePayment,
}) => {
  if (!isOpen) return null;

  // Filtreleme (belirli bir borç için açıldıysa o borcun kayıtları, yoksa tümü)
  const filteredPayments = selectedDebtId
    ? payments.filter(p => p.debt_id === selectedDebtId)
    : payments;

  const totalPaid = filteredPayments.reduce((sum, p) => sum + p.amount, 0);

  const getDebtInfo = (debtId: string) => {
    return debts.find(d => d.id === debtId);
  };

  const getPaymentTypeLabel = (type: string) => {
    switch (type) {
      case 'minimum': return 'Asgari Ödeme';
      case 'statement_full': return 'Tam Ekstre';
      case 'partial': return 'Kısmi Ara Ödeme';
      case 'installment': return 'Taksit';
      case 'close_debt': return 'Borç Kapatma';
      default: return 'Ödeme';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Başlık */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Ödeme Geçmişi
              </h3>
              <p className="text-xs text-slate-400">
                {selectedDebtId ? 'Bu borca ait ödemeler' : 'Tüm kayıtlı ödemeler'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toplam Ödenen Özet Kutusu */}
        <div className="p-4 bg-slate-950/40 border-b border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 block">Kayıtlı Toplam Ödeme</span>
            <span className="text-lg font-black text-emerald-400">
              {formatCurrency(totalPaid)}
            </span>
          </div>
          <span className="text-xs text-slate-400 bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700">
            {filteredPayments.length} Kayıt
          </span>
        </div>

        {/* Kayıt Listesi */}
        <div className="p-4 space-y-2.5 overflow-y-auto flex-1">
          {filteredPayments.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-xs">
              Henüz kaydedilmiş bir ödeme bulunmuyor.
            </div>
          ) : (
            filteredPayments.map((p) => {
              const d = getDebtInfo(p.debt_id);
              return (
                <div
                  key={p.id}
                  className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-white block">
                        {d ? `${d.bank} - ${d.name}` : 'Bilinmeyen Borç'}
                      </span>
                      <div className="flex items-center gap-2 text-slate-400 text-[11px] mt-0.5">
                        <span>{formatDateTR(p.payment_date)}</span>
                        <span>•</span>
                        <span className="text-emerald-400 font-medium">
                          {getPaymentTypeLabel(p.payment_type)}
                        </span>
                      </div>
                      {p.note && (
                        <p className="text-[11px] text-slate-400 italic mt-1">
                          "{p.note}"
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-sm font-bold text-emerald-400">
                      {formatCurrency(p.amount)}
                    </span>
                    <button
                      onClick={() => onDeletePayment(p.id)}
                      title="Ödemeyi Sil"
                      className="p-1 rounded text-slate-500 hover:text-rose-400 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
