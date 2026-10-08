'use client';

import React, { useState } from 'react';
import { CalculatedDebtStatus } from '@/lib/types';
import { formatCurrency, formatDateTR } from '@/lib/calculations';
import { getBankTheme } from '@/lib/bankColors';
import { CalendarDays, ChevronLeft, ChevronRight, Banknote, Calendar as CalendarIcon, CheckCircle2 } from 'lucide-react';

interface CalendarViewProps {
  debts: CalculatedDebtStatus[];
  onPayDebt: (debtId: string) => void;
}

interface CalendarPaymentItem {
  id: string;
  debtId: string;
  title: string;
  bank: string;
  date: string;
  amount: number;
  type: string;
  isOverdue?: boolean;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  debts,
  onPayDebt,
}) => {
  const [selectedMonth, setSelectedMonth] = useState<'2026-10' | '2026-11' | '2026-12'>('2026-10');

  // Ekim 2026 için kalemler
  const octoberItems: CalendarPaymentItem[] = [
    {
      id: 'oct-1',
      debtId: 'debt-overdue-5k',
      title: '5.000 TL Limitli Kredi Kartı',
      bank: 'Banka Belirlenecek',
      date: '30.09.2026 (Gecikmiş)',
      amount: 4894.09,
      type: 'Kredi Kartı Ekstresi',
      isOverdue: true,
    },
    {
      id: 'oct-2',
      debtId: 'debt-axess-business',
      title: 'Axess Business (Limit Aşımı)',
      bank: 'Akbank',
      date: '18.10.2026',
      amount: 31072.24,
      type: 'Kredi Kartı Ekstresi',
    },
    {
      id: 'oct-3',
      debtId: 'debt-kart-yapilandirma-49',
      title: 'Kredi Kartı Yapılandırması (3/49)',
      bank: 'Banka Belirlenecek',
      date: '20.10.2026',
      amount: 4843.03,
      type: 'Yapılandırma Taksiti',
    },
    {
      id: 'oct-4',
      debtId: 'debt-taksitli-kart',
      title: 'Taksitli Kart Borcu (1/48)',
      bank: 'Banka Belirlenecek',
      date: '23.10.2026',
      amount: 16384.32,
      type: 'Aylık Taksit',
    },
    {
      id: 'oct-5',
      debtId: 'debt-akbank-kart',
      title: 'Akbank Kart',
      bank: 'Akbank',
      date: '28.10.2026',
      amount: 21739.48,
      type: 'Kredi Kartı Borcu',
    },
    {
      id: 'oct-6',
      debtId: 'debt-ykb-worldcard',
      title: 'Yapı Kredi Worldcard',
      bank: 'Yapı Kredi',
      date: '30.10.2026',
      amount: 41776.18,
      type: 'Kredi Kartı Ekstresi',
    },
    {
      id: 'oct-7',
      debtId: 'debt-ykb-esnek',
      title: 'Yapı Kredi Esnek Hesap',
      bank: 'Yapı Kredi',
      date: '31.10.2026',
      amount: 2425.00,
      type: 'KMH Faiz/Asgari',
    },
  ];

  // Kasım 2026 için kalemler
  const novemberItems: CalendarPaymentItem[] = [
    {
      id: 'nov-1',
      debtId: 'debt-enpara-kmh-yapilandirma',
      title: 'Enpara KMH Yapılandırması (1/34)',
      bank: 'Enpara',
      date: '02.11.2026',
      amount: 5957.00,
      type: 'KMH Yapılandırma İlk Taksit',
    },
    {
      id: 'nov-2',
      debtId: 'debt-kart-yapilandirma-49',
      title: 'Kredi Kartı Yapılandırması (4/49)',
      bank: 'Banka Belirlenecek',
      date: '20.11.2026',
      amount: 4843.03,
      type: 'Yapılandırma Taksiti',
    },
    {
      id: 'nov-3',
      debtId: 'debt-taksitli-kart',
      title: 'Taksitli Kart Borcu (2/48)',
      bank: 'Banka Belirlenecek',
      date: '23.11.2026',
      amount: 16384.32,
      type: 'Aylık Taksit',
    },
  ];

  // Aralık 2026 için kalemler
  const decemberItems: CalendarPaymentItem[] = [
    {
      id: 'dec-1',
      debtId: 'debt-enpara-kmh-yapilandirma',
      title: 'Enpara KMH Yapılandırması (2/34)',
      bank: 'Enpara',
      date: '02.12.2026',
      amount: 5957.00,
      type: 'KMH Yapılandırma Taksiti',
    },
    {
      id: 'dec-2',
      debtId: 'debt-kart-yapilandirma-49',
      title: 'Kredi Kartı Yapılandırması (5/49)',
      bank: 'Banka Belirlenecek',
      date: '20.12.2026',
      amount: 4843.03,
      type: 'Yapılandırma Taksiti',
    },
    {
      id: 'dec-3',
      debtId: 'debt-taksitli-kart',
      title: 'Taksitli Kart Borcu (3/48)',
      bank: 'Banka Belirlenecek',
      date: '23.12.2026',
      amount: 16384.32,
      type: 'Aylık Taksit',
    },
  ];

  const currentItems = 
    selectedMonth === '2026-10' ? octoberItems :
    selectedMonth === '2026-11' ? novemberItems : decemberItems;

  const monthTotal = currentItems.reduce((acc, item) => acc + item.amount, 0);

  const monthNames = {
    '2026-10': 'EKİM 2026',
    '2026-11': 'KASIM 2026',
    '2026-12': 'ARALIK 2026',
  };

  return (
    <div className="space-y-4">
      {/* Ay Seçici & Başlık */}
      <div className="bg-white dark:bg-slate-900/90 rounded-2xl p-4 sm:p-5 border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
              ÖDEME PLANI VE VADE TAKVİMİ
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Gelecek ayların taksit ve ekstre projeksiyonu
          </p>
        </div>

        {/* Ay Butonları */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-slate-800 self-start sm:self-auto">
          <button
            onClick={() => setSelectedMonth('2026-10')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              selectedMonth === '2026-10'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Ekim 2026
          </button>
          <button
            onClick={() => setSelectedMonth('2026-11')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              selectedMonth === '2026-11'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Kasım 2026
          </button>
          <button
            onClick={() => setSelectedMonth('2026-12')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              selectedMonth === '2026-12'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Aralık 2026
          </button>
        </div>
      </div>

      {/* Seçili Ayın Toplam Ödeme Yükü */}
      <div className="bg-gradient-to-r from-emerald-50 via-white to-slate-50 dark:from-emerald-950/40 dark:via-slate-900 dark:to-slate-950 p-4 rounded-2xl border border-emerald-200 dark:border-emerald-500/20 shadow-xs flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider block">
            {monthNames[selectedMonth]} TOPLAM ÖDEME YÜKÜ
          </span>
          <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-0.5 block">
            {formatCurrency(monthTotal)}
          </span>
        </div>
        <span className="text-xs text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700/60 font-medium">
          {currentItems.length} Kalem Ödeme
        </span>
      </div>

      {/* Ödeme Kalemleri Listesi */}
      <div className="space-y-2.5">
        {currentItems.map((item) => {
          const bankTheme = getBankTheme(item.bank);
          return (
            <div
              key={item.id}
              className={`rounded-2xl p-4 border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative overflow-hidden shadow-xs ${
                item.isOverdue
                  ? 'bg-rose-50/70 dark:bg-rose-950/30 border-rose-200 dark:border-rose-500/40'
                  : 'bg-white dark:bg-slate-900/80 border-slate-200/90 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              {/* Banka Rengi Üst İnce Şerit */}
              <div
                className="absolute top-0 left-0 right-0 h-1"
                style={{
                  background: `linear-gradient(90deg, ${bankTheme.primary}, ${bankTheme.secondary})`,
                }}
              />

              <div className="flex items-start gap-3 pt-0.5">
                <div
                  className="p-2.5 rounded-xl border flex items-center justify-center text-white shrink-0 shadow-md"
                  style={{
                    background: `linear-gradient(135deg, ${bankTheme.primary}, ${bankTheme.secondary})`,
                    borderColor: 'rgba(255, 255, 255, 0.15)',
                  }}
                >
                  <CalendarIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${bankTheme.badgeBg} ${bankTheme.badgeText} ${bankTheme.badgeBorder}`}
                    >
                      {item.bank}
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 px-1.5 py-0.2 bg-slate-100 dark:bg-slate-800 rounded">
                      {item.type}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                    {item.title}
                  </h4>
                  <div className="flex items-center gap-2 mt-1 text-xs text-slate-500 dark:text-slate-400">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">Vade: {item.date}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 border-slate-100 dark:border-slate-800 pt-2 sm:pt-0">
                <div className="text-left sm:text-right">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Ödeme Tutarı</span>
                  <span className="text-base font-bold text-emerald-600 dark:text-emerald-400">
                    {formatCurrency(item.amount)}
                  </span>
                </div>

                {item.debtId && (
                  <button
                    onClick={() => onPayDebt(item.debtId)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20 active:scale-95 transition-all"
                  >
                    <Banknote className="w-3.5 h-3.5" />
                    <span>Öde</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
