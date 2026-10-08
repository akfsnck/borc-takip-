'use client';

import React, { useState, useEffect } from 'react';
import { Debt, PaymentRecord, CalculatedDebtStatus, DebtType } from '@/lib/types';
import { StorageService } from '@/lib/storage';
import { calculateDebtStatus, calculateFinancialHealth, DEFAULT_APP_DATE } from '@/lib/calculations';
import { Header } from '@/components/Header';
import { BottomNav, TabType } from '@/components/BottomNav';
import { DashboardSummary } from '@/components/DashboardSummary';
import { TodayActions } from '@/components/TodayActions';
import { UrgentPayments } from '@/components/UrgentPayments';
import { DebtCard } from '@/components/DebtCard';
import { PaymentModal } from '@/components/PaymentModal';
import { PaymentHistoryModal } from '@/components/PaymentHistoryModal';
import { AddDebtModal } from '@/components/AddDebtModal';
import { FinancialHealth } from '@/components/FinancialHealth';
import { CalendarView } from '@/components/CalendarView';
import { Search, Filter, CreditCard, Landmark, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';

export default function HomePage() {
  const [currentDate, setCurrentDate] = useState<string>(DEFAULT_APP_DATE);
  const [currentTab, setCurrentTab] = useState<TabType>('dashboard');
  const [debts, setDebts] = useState<Debt[]>([]);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  // Filtreler & Arama (Borçlar sekmesi için)
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modallar
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState<boolean>(false);
  const [activePaymentDebtId, setActivePaymentDebtId] = useState<string | null>(null);

  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState<boolean>(false);
  const [activeHistoryDebtId, setActiveHistoryDebtId] = useState<string | null>(null);

  const [isAddDebtModalOpen, setIsAddDebtModalOpen] = useState<boolean>(false);

  // Veri yükleme
  useEffect(() => {
    const loadedDebts = StorageService.getDebts();
    const loadedPayments = StorageService.getPayments();
    const settings = StorageService.getSettings();

    setDebts(loadedDebts);
    setPayments(loadedPayments);
    if (settings.appDate) {
      setCurrentDate(settings.appDate);
    }
    setIsLoaded(true);
  }, []);

  // Tarih değiştiğinde kaydet
  const handleDateChange = (newDate: string) => {
    setCurrentDate(newDate);
    const settings = StorageService.getSettings();
    StorageService.saveSettings({ ...settings, appDate: newDate });
  };

  // Veri sıfırlama
  const handleResetData = () => {
    if (confirm('Tüm veriler varsayılan başlangıç değerlerine (8 Ekim 2026 durumuna) sıfırlansın mı?')) {
      StorageService.resetToInitialData();
      setDebts(StorageService.getDebts());
      setPayments(StorageService.getPayments());
      setCurrentDate(DEFAULT_APP_DATE);
    }
  };

  // Yeni ödeme kaydetme
  const handleSavePayment = (paymentData: {
    debt_id: string;
    amount: number;
    payment_date: string;
    payment_type: any;
    note?: string;
  }) => {
    const newRecord = StorageService.addPayment(paymentData);
    setPayments(StorageService.getPayments());
    setDebts(StorageService.getDebts()); // Taksit güncellenmiş olabilir
  };

  // Ödeme silme
  const handleDeletePayment = (paymentId: string) => {
    StorageService.deletePayment(paymentId);
    setPayments(StorageService.getPayments());
  };

  // Yeni borç ekleme
  const handleAddDebt = (debtData: Omit<Debt, 'id' | 'created_at' | 'updated_at'>) => {
    const created = StorageService.addDebt(debtData);
    setDebts(StorageService.getDebts());
  };

  // Modal tetikleyiciler
  const triggerPaymentForDebt = (debtId: string) => {
    setActivePaymentDebtId(debtId);
    setIsPaymentModalOpen(true);
  };

  const triggerHistoryForDebt = (debtId?: string) => {
    setActiveHistoryDebtId(debtId || null);
    setIsHistoryModalOpen(true);
  };

  // Tüm borçların hesaplanmış durumları
  const calculatedStatuses: CalculatedDebtStatus[] = debts.map((d) =>
    calculateDebtStatus(d, payments, currentDate)
  );

  // Finansal sağlık metrikleri
  const financialMetrics = calculateFinancialHealth(debts, payments, currentDate);

  // Aktif ödeme modalındaki borç durumu
  const activeDebtStatus = activePaymentDebtId
    ? calculatedStatuses.find((s) => s.debt.id === activePaymentDebtId) || null
    : null;

  // Filtrelenmiş borç listesi
  const filteredDebts = calculatedStatuses.filter((item) => {
    const matchesSearch =
      item.debt.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.debt.bank.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.debt.last_four && item.debt.last_four.includes(searchQuery));

    if (!matchesSearch) return false;

    if (filterType === 'all') return true;
    if (filterType === 'credit_cards') return item.debt.type === 'credit_card' || item.debt.type === 'credit_card_installment';
    if (filterType === 'overdraft') return item.debt.type === 'overdraft';
    if (filterType === 'restructured') return item.debt.is_restructured || item.debt.type.startsWith('restructured');
    if (filterType === 'overdue') return item.isOverdue;
    if (filterType === 'paid') return item.remainingStatementBalance === 0;
    if (filterType === 'this_month') return item.daysUntilDue !== null && item.daysUntilDue <= 31;

    return true;
  });

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#090d16] text-slate-400">
        <div className="flex items-center gap-2">
          <RefreshCw className="w-5 h-5 animate-spin text-emerald-400" />
          <span>Yükleniyor...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#090d16] text-slate-100">
      {/* Üst Menü / Header */}
      <Header
        currentDate={currentDate}
        onDateChange={handleDateChange}
        onOpenAddModal={() => setIsAddDebtModalOpen(true)}
        onResetData={handleResetData}
      />

      {/* Ana Gövde */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-4 sm:py-6 space-y-6">
        {/* ======================= TAB 1: ANA SAYFA (DASHBOARD) ======================= */}
        {currentTab === 'dashboard' && (
          <div className="space-y-6 animate-in fade-in">
            {/* Büyük Konsolide Kart */}
            <DashboardSummary
              metrics={financialMetrics}
              onNavigateToOverdue={() => {
                setFilterType('overdue');
                setCurrentTab('debts');
              }}
            />

            {/* "Bugün Ne Yapmalıyım?" Bölümü */}
            <TodayActions
              metrics={financialMetrics}
              onPayDebt={triggerPaymentForDebt}
            />

            {/* Acil Ödemeler */}
            <UrgentPayments
              debts={calculatedStatuses}
              onPayDebt={triggerPaymentForDebt}
            />
          </div>
        )}

        {/* ======================= TAB 2: BORÇLAR LİSTESİ ======================= */}
        {currentTab === 'debts' && (
          <div className="space-y-4 animate-in fade-in">
            {/* Arama & Filtre Çubuğu */}
            <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800 space-y-3">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Banka, kart adı veya son 4 hane ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Filtre Butonları */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
                {[
                  { id: 'all', label: 'Tümü' },
                  { id: 'overdue', label: 'Gecikmiş 🔴' },
                  { id: 'credit_cards', label: 'Kredi Kartları' },
                  { id: 'overdraft', label: 'KMH / Ek Hesap' },
                  { id: 'restructured', label: 'Yapılandırmalar' },
                  { id: 'this_month', label: 'Bu Ay' },
                  { id: 'paid', label: 'Ödenenler 🟢' },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setFilterType(f.id)}
                    className={`px-3 py-1.5 rounded-xl whitespace-nowrap font-medium transition-all ${
                      filterType === f.id
                        ? 'bg-emerald-500 text-white font-bold shadow-md shadow-emerald-500/20'
                        : 'bg-slate-800/80 text-slate-400 hover:text-white border border-slate-700/60'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Borç Kartları Listesi */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {filteredDebts.length === 0 ? (
                <div className="col-span-full py-12 text-center text-slate-500 text-xs">
                  Arama kriterlerine uygun borç bulunamadı.
                </div>
              ) : (
                filteredDebts.map((item) => (
                  <DebtCard
                    key={item.debt.id}
                    status={item}
                    onPayClick={() => triggerPaymentForDebt(item.debt.id)}
                    onHistoryClick={() => triggerHistoryForDebt(item.debt.id)}
                  />
                ))
              )}
            </div>
          </div>
        )}

        {/* ======================= TAB 3: TAKVİM & AYLIK PLAN ======================= */}
        {currentTab === 'calendar' && (
          <div className="animate-in fade-in">
            <CalendarView
              debts={calculatedStatuses}
              onPayDebt={triggerPaymentForDebt}
            />
          </div>
        )}

        {/* ======================= TAB 4: ÖDEME GEÇMİŞİ ======================= */}
        {currentTab === 'payments' && (
          <div className="space-y-4 animate-in fade-in">
            <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white">ÖDEME GEÇMİŞİ VE KAYITLARI</h2>
                <p className="text-xs text-slate-400">Yapılan tüm tam ve kısmi (ara) ödemelerin dökümü</p>
              </div>
              <button
                onClick={() => {
                  if (debts.length > 0) triggerPaymentForDebt(debts[0].id);
                }}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md transition-all"
              >
                + Manuel Ödeme Ekle
              </button>
            </div>

            {payments.length === 0 ? (
              <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-8 text-center text-slate-400 text-xs">
                <CheckCircle className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                Henüz kayıtlı bir ödeme bulunmuyor. Bir borç kartındaki "Ödeme Yap" butonuna basarak kısmi veya tam ödeme kaydedebilirsiniz.
              </div>
            ) : (
              <div className="space-y-2">
                {payments.map((p) => {
                  const debt = debts.find((d) => d.id === p.debt_id);
                  return (
                    <div
                      key={p.id}
                      className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-xl flex items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <span className="font-bold text-white block">
                          {debt ? `${debt.bank} - ${debt.name}` : 'Bilinmeyen Borç'}
                        </span>
                        <div className="flex items-center gap-2 text-slate-400 text-[11px] mt-0.5">
                          <span>{p.payment_date}</span>
                          <span>•</span>
                          <span className="text-emerald-400 font-medium">{p.payment_type}</span>
                        </div>
                        {p.note && <p className="text-slate-400 italic text-[11px] mt-1">"{p.note}"</p>}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-emerald-400">
                          {p.amount.toLocaleString('tr-TR')} TL
                        </span>
                        <button
                          onClick={() => handleDeletePayment(p.id)}
                          className="text-slate-500 hover:text-rose-400"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ======================= TAB 5: ANALİZ & SAĞLIK ======================= */}
        {currentTab === 'analysis' && (
          <div className="animate-in fade-in">
            <FinancialHealth
              metrics={financialMetrics}
              calculatedDebts={calculatedStatuses}
              onPayDebt={triggerPaymentForDebt}
            />
          </div>
        )}
      </main>

      {/* Alt Navigasyon Menüsü */}
      <BottomNav
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        overdueBadgeCount={financialMetrics.overdueCount}
      />

      {/* Kısmi & Tam Ödeme Yap Modalı */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        status={activeDebtStatus}
        currentDate={currentDate}
        onSavePayment={handleSavePayment}
      />

      {/* Ödeme Geçmişi Detay Modalı */}
      <PaymentHistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        payments={payments}
        debts={debts}
        selectedDebtId={activeHistoryDebtId}
        onDeletePayment={handleDeletePayment}
      />

      {/* Yeni Borç Ekleme Modalı */}
      <AddDebtModal
        isOpen={isAddDebtModalOpen}
        onClose={() => setIsAddDebtModalOpen(false)}
        onAddDebt={handleAddDebt}
      />
    </div>
  );
}
