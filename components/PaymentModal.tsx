'use client';

import React, { useState, useEffect } from 'react';
import { Debt, PaymentType } from '@/lib/types';
import { CalculatedDebtStatus } from '@/lib/types';
import { formatCurrency, formatPercent } from '@/lib/calculations';
import { X, Check, Banknote, ShieldCheck, ArrowRight, FileText, AlertCircle } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  status: CalculatedDebtStatus | null;
  currentDate: string;
  onSavePayment: (data: {
    debt_id: string;
    amount: number;
    payment_date: string;
    payment_type: PaymentType;
    note?: string;
  }) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  status,
  currentDate,
  onSavePayment,
}) => {
  if (!isOpen || !status) return null;

  const { debt, remainingStatementBalance, remainingMinimumPayment, effectiveCurrentBalance } = status;

  // Form states
  const [amountStr, setAmountStr] = useState<string>('');
  const [paymentType, setPaymentType] = useState<PaymentType>('partial');
  const [paymentDate, setPaymentDate] = useState<string>(currentDate);
  const [note, setNote] = useState<string>('');

  // Başlangıçta varsayılan tutarı hazırla
  useEffect(() => {
    if (remainingMinimumPayment > 0) {
      setAmountStr(remainingMinimumPayment.toFixed(2));
      setPaymentType('minimum');
    } else if (remainingStatementBalance > 0) {
      setAmountStr(remainingStatementBalance.toFixed(2));
      setPaymentType('statement_full');
    } else {
      setAmountStr((debt.monthly_installment || 1000).toFixed(2));
      setPaymentType('installment');
    }
    setPaymentDate(currentDate);
    setNote('');
  }, [status, currentDate]);

  const parsedAmount = parseFloat(amountStr) || 0;

  // Dinamik önizleme hesapları
  const previewRemainingStatement = Math.max(0, remainingStatementBalance - parsedAmount);
  const previewRemainingMinimum = Math.max(0, remainingMinimumPayment - parsedAmount);
  const isMinimumCovered = parsedAmount >= remainingMinimumPayment && remainingMinimumPayment > 0;
  const isFullyCovered = parsedAmount >= remainingStatementBalance && remainingStatementBalance > 0;

  // Yeni tahmini limit kullanımı
  let previewUtilization = status.utilizationRate;
  if (debt.credit_limit && debt.credit_limit > 0) {
    const newBal = Math.max(0, effectiveCurrentBalance - parsedAmount);
    previewUtilization = (newBal / debt.credit_limit) * 100;
  }

  const handleQuickSelect = (type: 'minimum' | 'statement' | 'custom10k' | 'installment') => {
    if (type === 'minimum') {
      setAmountStr(remainingMinimumPayment.toFixed(2));
      setPaymentType('minimum');
    } else if (type === 'statement') {
      setAmountStr(remainingStatementBalance.toFixed(2));
      setPaymentType('statement_full');
    } else if (type === 'custom10k') {
      setAmountStr('10000');
      setPaymentType('partial');
    } else if (type === 'installment' && debt.monthly_installment) {
      setAmountStr(debt.monthly_installment.toFixed(2));
      setPaymentType('installment');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (parsedAmount <= 0) {
      alert('Lütfen geçerli bir ödeme tutarı girin.');
      return;
    }

    onSavePayment({
      debt_id: debt.id,
      amount: parsedAmount,
      payment_date: paymentDate,
      payment_type: paymentType,
      note: note.trim() || undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Başlık */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
              <Banknote className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                Ödeme Yap & Güncelle
              </h3>
              <p className="text-xs text-slate-400">
                {debt.bank} • {debt.name} {debt.last_four ? `(•••• ${debt.last_four})` : ''}
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

        {/* Gövde Formu */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-4 overflow-y-auto">
          {/* Mevcut Durum Kutusu */}
          <div className="grid grid-cols-2 gap-2 bg-slate-950/40 p-3 rounded-xl border border-slate-800/80 text-xs">
            <div>
              <span className="text-slate-400 block">Kalan Ekstre / Taksit:</span>
              <span className="text-sm font-bold text-white">
                {formatCurrency(remainingStatementBalance || effectiveCurrentBalance)}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block">Kalan Asgari Tutar:</span>
              <span className="text-sm font-bold text-amber-400">
                {formatCurrency(remainingMinimumPayment)}
              </span>
            </div>
          </div>

          {/* Hızlı Seçim Butonları */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              Hızlı Tutar Seçenekleri:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {remainingMinimumPayment > 0 && (
                <button
                  type="button"
                  onClick={() => handleQuickSelect('minimum')}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition-all text-left"
                >
                  <span className="block text-[10px] text-amber-400">Asgari Tutar:</span>
                  <span className="font-bold">{formatCurrency(remainingMinimumPayment)}</span>
                </button>
              )}

              {remainingStatementBalance > 0 && (
                <button
                  type="button"
                  onClick={() => handleQuickSelect('statement')}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 transition-all text-left"
                >
                  <span className="block text-[10px] text-emerald-400">Tam Ekstre:</span>
                  <span className="font-bold">{formatCurrency(remainingStatementBalance)}</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => handleQuickSelect('custom10k')}
                className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 transition-all text-left"
              >
                <span className="block text-[10px] text-cyan-400">Ara Kısmi Ödeme:</span>
                <span className="font-bold">10.000 TL</span>
              </button>
            </div>
          </div>

          {/* Tutar Girişi */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Ödenecek Tutar (TL): *
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-slate-400 font-bold text-sm">₺</span>
              <input
                type="number"
                step="0.01"
                min="1"
                value={amountStr}
                onChange={(e) => setAmountStr(e.target.value)}
                placeholder="0.00"
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-8 pr-4 py-2.5 text-base font-bold text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
          </div>

          {/* Ödeme Türü & Tarih */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Ödeme Türü:
              </label>
              <select
                value={paymentType}
                onChange={(e) => setPaymentType(e.target.value as PaymentType)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-medium text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                <option value="partial">Kısmi Ödeme (Ara Ödeme)</option>
                <option value="minimum">Asgari Ödeme</option>
                <option value="statement_full">Tam Ekstre Borcu</option>
                <option value="installment">Taksit Ödemesi</option>
                <option value="close_debt">Borcu Kapatma</option>
                <option value="other">Diğer</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Ödeme Tarihi:
              </label>
              <input
                type="date"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-medium text-slate-200 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Not / Dekont Bilgisi */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Not / Dekont No:
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Örn: Maaş hesabından ödendi / Dekont: 48921"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* CANLI ÖNİZLEME (Kullanıcının tam olarak istediği akıllı simülasyon) */}
          <div className="bg-gradient-to-br from-emerald-950/30 to-slate-950 border border-emerald-500/30 rounded-xl p-3.5 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>Ödeme Sonrası Canlı Simülasyon:</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs text-slate-300 pt-1">
              <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                <span className="text-[11px] text-slate-400 block">Kalan Ekstre:</span>
                <span className={`font-bold ${previewRemainingStatement === 0 ? 'text-emerald-400' : 'text-white'}`}>
                  {formatCurrency(previewRemainingStatement)}
                </span>
              </div>

              <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                <span className="text-[11px] text-slate-400 block">Kalan Asgari:</span>
                <span className={`font-bold ${previewRemainingMinimum === 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {previewRemainingMinimum === 0 ? '0,00 TL (Karşılandı ✓)' : formatCurrency(previewRemainingMinimum)}
                </span>
              </div>
            </div>

            {debt.credit_limit && (
              <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1">
                <span>Limit Kullanım Oranı:</span>
                <div className="flex items-center gap-1.5 font-bold">
                  <span className="text-slate-500 line-through">{formatPercent(status.utilizationRate)}</span>
                  <ArrowRight className="w-3 h-3 text-emerald-400" />
                  <span className={previewUtilization < 70 ? 'text-emerald-400' : previewUtilization < 90 ? 'text-amber-400' : 'text-rose-400'}>
                    {formatPercent(previewUtilization)}
                  </span>
                </div>
              </div>
            )}

            {isMinimumCovered && (
              <p className="text-[11px] text-emerald-300 font-medium">
                ✅ Bu ödeme ile asgari tutar tamamen karşılanır ve gecikme riski ortadan kalkar!
              </p>
            )}
          </div>

          {/* Aksiyon Butonları */}
          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              İptal
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg shadow-emerald-600/30 active:scale-95 transition-all"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Ödemeyi Kaydet ({formatCurrency(parsedAmount)})</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
