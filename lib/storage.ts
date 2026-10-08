'use client';

import { Debt, PaymentRecord } from './types';
import { INITIAL_DEBTS, INITIAL_PAYMENTS } from './initialData';

const DEBTS_STORAGE_KEY = 'borc_takip_debts_v1';
const PAYMENTS_STORAGE_KEY = 'borc_takip_payments_v1';
const SETTINGS_STORAGE_KEY = 'borc_takip_settings_v1';

export interface AppSettings {
  appDate: string; // YYYY-MM-DD (varsayılan: 2026-10-08)
  theme: 'dark' | 'light' | 'system';
  enableNotifications: boolean;
}

const DEFAULT_SETTINGS: AppSettings = {
  appDate: '2026-10-08',
  theme: 'dark',
  enableNotifications: true,
};

export const StorageService = {
  getDebts(): Debt[] {
    if (typeof window === 'undefined') return INITIAL_DEBTS;
    try {
      const data = localStorage.getItem(DEBTS_STORAGE_KEY);
      if (!data) {
        localStorage.setItem(DEBTS_STORAGE_KEY, JSON.stringify(INITIAL_DEBTS));
        return INITIAL_DEBTS;
      }
      return JSON.parse(data);
    } catch (e) {
      console.error('Borçlar yüklenemedi:', e);
      return INITIAL_DEBTS;
    }
  },

  saveDebts(debts: Debt[]): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(DEBTS_STORAGE_KEY, JSON.stringify(debts));
    } catch (e) {
      console.error('Borçlar kaydedilemedi:', e);
    }
  },

  getPayments(): PaymentRecord[] {
    if (typeof window === 'undefined') return INITIAL_PAYMENTS;
    try {
      const data = localStorage.getItem(PAYMENTS_STORAGE_KEY);
      if (!data) {
        localStorage.setItem(PAYMENTS_STORAGE_KEY, JSON.stringify(INITIAL_PAYMENTS));
        return INITIAL_PAYMENTS;
      }
      return JSON.parse(data);
    } catch (e) {
      console.error('Ödemeler yüklenemedi:', e);
      return INITIAL_PAYMENTS;
    }
  },

  savePayments(payments: PaymentRecord[]): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(PAYMENTS_STORAGE_KEY, JSON.stringify(payments));
    } catch (e) {
      console.error('Ödemeler kaydedilemedi:', e);
    }
  },

  addPayment(payment: Omit<PaymentRecord, 'id' | 'created_at'>): PaymentRecord {
    const payments = this.getPayments();
    const newRecord: PaymentRecord = {
      ...payment,
      id: 'pay-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      created_at: new Date().toISOString(),
    };
    payments.unshift(newRecord);
    this.savePayments(payments);

    // Eğer taksitli borçsa taksit sayısını güncelle
    const debts = this.getDebts();
    const debtIndex = debts.findIndex(d => d.id === payment.debt_id);
    if (debtIndex !== -1) {
      const debt = debts[debtIndex];
      if (debt.paid_installments !== undefined && debt.remaining_installments !== undefined) {
        debt.paid_installments += 1;
        debt.remaining_installments = Math.max(0, debt.remaining_installments - 1);
        debt.updated_at = new Date().toISOString();
        this.saveDebts(debts);
      }
    }

    return newRecord;
  },

  deletePayment(paymentId: string): void {
    const payments = this.getPayments().filter(p => p.id !== paymentId);
    this.savePayments(payments);
  },

  addDebt(debt: Omit<Debt, 'id' | 'created_at' | 'updated_at'>): Debt {
    const debts = this.getDebts();
    const newDebt: Debt = {
      ...debt,
      id: 'debt-' + Date.now(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    debts.push(newDebt);
    this.saveDebts(debts);
    return newDebt;
  },

  updateDebt(updatedDebt: Debt): void {
    const debts = this.getDebts().map(d => (d.id === updatedDebt.id ? { ...updatedDebt, updated_at: new Date().toISOString() } : d));
    this.saveDebts(debts);
  },

  deleteDebt(debtId: string): void {
    const debts = this.getDebts().filter(d => d.id !== debtId);
    const payments = this.getPayments().filter(p => p.debt_id !== debtId);
    this.saveDebts(debts);
    this.savePayments(payments);
  },

  getSettings(): AppSettings {
    if (typeof window === 'undefined') return DEFAULT_SETTINGS;
    try {
      const data = localStorage.getItem(SETTINGS_STORAGE_KEY);
      return data ? JSON.parse(data) : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  },

  saveSettings(settings: AppSettings): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  },

  resetToInitialData(): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(DEBTS_STORAGE_KEY, JSON.stringify(INITIAL_DEBTS));
    localStorage.setItem(PAYMENTS_STORAGE_KEY, JSON.stringify(INITIAL_PAYMENTS));
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(DEFAULT_SETTINGS));
  },
};
