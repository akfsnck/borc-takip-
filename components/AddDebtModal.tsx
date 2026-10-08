'use client';

import React, { useState } from 'react';
import { Debt, DebtType } from '@/lib/types';
import { X, Plus, CreditCard, Landmark, Check } from 'lucide-react';

interface AddDebtModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddDebt: (debt: Omit<Debt, 'id' | 'created_at' | 'updated_at'>) => void;
}

export const AddDebtModal: React.FC<AddDebtModalProps> = ({
  isOpen,
  onClose,
  onAddDebt,
}) => {
  if (!isOpen) return null;

  const [type, setType] = useState<DebtType>('credit_card');
  const [bank, setBank] = useState('');
  const [name, setName] = useState('');
  const [lastFour, setLastFour] = useState('');
  const [creditLimit, setCreditLimit] = useState('');
  const [currentBalance, setCurrentBalance] = useState('');
  const [statementBalance, setStatementBalance] = useState('');
  const [minimumPayment, setMinimumPayment] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [statementDate, setStatementDate] = useState('');
  const [monthlyInstallment, setMonthlyInstallment] = useState('');
  const [totalInstallments, setTotalInstallments] = useState('');
  const [paidInstallments, setPaidInstallments] = useState('0');
  const [note, setNote] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bank.trim() || !name.trim()) {
      alert('Lütfen en az banka ve borç adını doldurun.');
      return;
    }

    const newDebt: Omit<Debt, 'id' | 'created_at' | 'updated_at'> = {
      name: name.trim(),
      bank: bank.trim(),
      type,
      last_four: lastFour.trim() ? lastFour.trim().slice(-4) : undefined,
      credit_limit: creditLimit ? parseFloat(creditLimit) : undefined,
      current_balance: currentBalance ? parseFloat(currentBalance) : undefined,
      statement_balance: statementBalance ? parseFloat(statementBalance) : undefined,
      minimum_payment: minimumPayment ? parseFloat(minimumPayment) : undefined,
      due_date: dueDate || undefined,
      statement_date: statementDate || undefined,
      monthly_installment: monthlyInstallment ? parseFloat(monthlyInstallment) : undefined,
      total_installments: totalInstallments ? parseInt(totalInstallments) : undefined,
      paid_installments: paidInstallments ? parseInt(paidInstallments) : 0,
      remaining_installments: totalInstallments ? parseInt(totalInstallments) - (parseInt(paidInstallments) || 0) : undefined,
      note: note.trim() || undefined,
      status: 'active',
      is_restructured: type.startsWith('restructured'),
    };

    onAddDebt(newDebt);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Başlık */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Yeni Borç / Hesap Ekle</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Kart, KMH, kredi veya yapılandırma kaydet</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-3.5 overflow-y-auto">
          {/* Tür Seçimi */}
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Borç Türü:</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as DebtType)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 dark:text-slate-200 focus:outline-none focus:border-emerald-500"
            >
              <option value="credit_card">Kredi Kartı</option>
              <option value="credit_card_installment">Taksitli Kart Borcu</option>
              <option value="overdraft">KMH / Ek Hesap / Esnek Hesap</option>
              <option value="restructured_credit_card">Yapılandırılmış Kredi Kartı</option>
              <option value="restructured_overdraft">Yapılandırılmış KMH</option>
              <option value="loan">İhtiyaç / Taşıt Kredisi</option>
              <option value="other">Diğer Borç</option>
            </select>
          </div>

          {/* Banka ve Borç Adı */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Banka Adı: *</label>
              <input
                type="text"
                placeholder="Örn: Yapı Kredi, Akbank, Garanti"
                value={bank}
                onChange={(e) => setBank(e.target.value)}
                required
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Borç / Hesap Adı: *</label>
              <input
                type="text"
                placeholder="Örn: Worldcard, Esnek Hesap"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Son 4 Hane & Limit */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Kartın Son 4 Hanesi: <span className="text-slate-400 text-[11px]">(Güvenlik için sadece 4 hane)</span>
              </label>
              <input
                type="text"
                maxLength={4}
                placeholder="Örn: 6734"
                value={lastFour}
                onChange={(e) => setLastFour(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Toplam Limit (TL):</label>
              <input
                type="number"
                step="0.01"
                placeholder="Örn: 43800"
                value={creditLimit}
                onChange={(e) => setCreditLimit(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Güncel Borç & Ekstre Borcu */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Güncel Borç (TL):</label>
              <input
                type="number"
                step="0.01"
                placeholder="Örn: 42192.85"
                value={currentBalance}
                onChange={(e) => setCurrentBalance(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Son Ekstre Borcu (TL):</label>
              <input
                type="number"
                step="0.01"
                placeholder="Örn: 41776.18"
                value={statementBalance}
                onChange={(e) => setStatementBalance(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Asgari Ödeme & Son Ödeme Tarihi */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Asgari Ödeme (TL):</label>
              <input
                type="number"
                step="0.01"
                placeholder="Örn: 8355.24"
                value={minimumPayment}
                onChange={(e) => setMinimumPayment(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Son Ödeme Tarihi:</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Taksit Bilgileri (Taksitliyse) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 bg-slate-50 dark:bg-slate-950/60 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
            <div>
              <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">Aylık Taksit (TL):</label>
              <input
                type="number"
                step="0.01"
                placeholder="Örn: 4843.03"
                value={monthlyInstallment}
                onChange={(e) => setMonthlyInstallment(e.target.value)}
                className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 dark:text-slate-200"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">Toplam Taksit:</label>
              <input
                type="number"
                placeholder="Örn: 49"
                value={totalInstallments}
                onChange={(e) => setTotalInstallments(e.target.value)}
                className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 dark:text-slate-200"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">Ödenmiş Taksit:</label>
              <input
                type="number"
                placeholder="Örn: 2"
                value={paidInstallments}
                onChange={(e) => setPaidInstallments(e.target.value)}
                className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 dark:text-slate-200"
              />
            </div>
          </div>

          {/* Not */}
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Not / Hatırlatma:</label>
            <input
              type="text"
              placeholder="Örn: Otomatik ödeme talimatı yok"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Butonlar */}
          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              İptal
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-md active:scale-95 transition-all"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Kaydet</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
