import { Debt, PaymentRecord, CalculatedDebtStatus, FinancialHealthMetrics } from './types';

// Standart referans tarih (Kullanıcının talep ettiği güncel takvim: 08 Ekim 2026)
export const DEFAULT_APP_DATE = '2026-10-08';

export function getDaysDifference(targetDateStr: string, baseDateStr: string = DEFAULT_APP_DATE): number {
  const target = new Date(targetDateStr + 'T00:00:00');
  const base = new Date(baseDateStr + 'T00:00:00');
  const diffTime = target.getTime() - base.getTime();
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
}

export function formatDateTR(dateStr?: string): string {
  if (!dateStr) return '—';
  try {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return `${parts[2]}.${parts[1]}.${parts[0]}`;
    }
    const d = new Date(dateStr);
    return d.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

export function formatCurrency(amount?: number): string {
  if (amount === undefined || amount === null || isNaN(amount)) return '0,00 TL';
  return new Intl.NumberFormat('tr-TR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount) + ' TL';
}

export function formatPercent(rate?: number): string {
  if (rate === undefined || rate === null || isNaN(rate)) return '%0';
  return '%' + rate.toFixed(1).replace('.', ',');
}

export function calculateDebtStatus(
  debt: Debt,
  allPayments: PaymentRecord[],
  baseDate: string = DEFAULT_APP_DATE
): CalculatedDebtStatus {
  // Bu borca ait yapılan toplam ödemeler
  const debtPayments = allPayments.filter(p => p.debt_id === debt.id);
  const totalPaidThisCycle = debtPayments.reduce((acc, p) => acc + p.amount, 0);

  // Orijinal baz tutarlar
  const originalStatement = debt.statement_balance ?? debt.monthly_installment ?? (debt.current_balance || 0);
  const originalMinimum = debt.minimum_payment ?? debt.monthly_installment ?? (originalStatement * 0.2);
  const originalCurrent = debt.current_balance ?? debt.statement_balance ?? (debt.total_repayment || 0);
  const originalLimit = debt.credit_limit ?? debt.overdraft_limit ?? 0;

  // Kısmi ödeme düşüldükten sonra kalan tutarlar
  const remainingStatementBalance = Math.max(0, originalStatement - totalPaidThisCycle);
  const remainingMinimumPayment = Math.max(0, originalMinimum - totalPaidThisCycle);
  const effectiveCurrentBalance = Math.max(0, originalCurrent - totalPaidThisCycle);
  
  // Efektif kullanılabilir limit
  let effectiveAvailableLimit = debt.available_limit ?? (originalLimit > 0 ? originalLimit - effectiveCurrentBalance : 0);
  if (debt.credit_limit && debt.credit_limit > 0) {
    effectiveAvailableLimit = debt.credit_limit - effectiveCurrentBalance;
  }

  // Kullanım oranı
  let utilizationRate = 0;
  if (debt.type === 'overdraft' && debt.overdraft_limit && debt.overdraft_limit > 0) {
    const used = Math.max(0, (debt.used_amount ?? effectiveCurrentBalance) - totalPaidThisCycle);
    utilizationRate = (used / debt.overdraft_limit) * 100;
  } else if (debt.credit_limit && debt.credit_limit > 0) {
    utilizationRate = (effectiveCurrentBalance / debt.credit_limit) * 100;
  }

  // Limit aşımı
  const isLimitExceeded = (originalLimit > 0 && effectiveCurrentBalance > originalLimit) || effectiveAvailableLimit < 0;
  const limitExceededAmount = isLimitExceeded ? Math.abs(Math.min(0, effectiveAvailableLimit)) : 0;

  // Vade & Gecikme hesaplaması
  let daysUntilDue: number | null = null;
  let isOverdue = false;
  let overdueDays = 0;

  if (debt.due_date) {
    daysUntilDue = getDaysDifference(debt.due_date, baseDate);
    // Borç ödenmemişse ve tarih geçmişse gecikmiş
    if (daysUntilDue < 0 && remainingMinimumPayment > 0) {
      isOverdue = true;
      overdueDays = Math.abs(daysUntilDue);
    }
  }

  // Kullanım seviyeleri
  const isHighUtilization = utilizationRate >= 90;
  const isWarningUtilization = utilizationRate >= 70 && utilizationRate < 90;

  // Risk Skoru Motoru
  let riskScore = 0;
  if (remainingStatementBalance > 0) {
    if (isOverdue) riskScore += 100 + overdueDays * 2;
    if (isLimitExceeded) riskScore += 80;
    if (daysUntilDue !== null && daysUntilDue === 0) riskScore += 70;
    if (daysUntilDue !== null && daysUntilDue > 0 && daysUntilDue <= 3) riskScore += 60;
    if (daysUntilDue !== null && daysUntilDue > 3 && daysUntilDue <= 7) riskScore += 40;
    if (debt.type === 'overdraft' && isHighUtilization) riskScore += 50;
    else if (isHighUtilization) riskScore += 40;
    else if (isWarningUtilization) riskScore += 20;
  }

  // Renk ve Badge tespiti
  let riskColor: 'red' | 'orange' | 'yellow' | 'green' = 'green';
  let badge: CalculatedDebtStatus['statusBadge'] = {
    text: 'Düzenli',
    color: 'green',
  };

  if (remainingStatementBalance <= 0 && totalPaidThisCycle > 0) {
    riskColor = 'green';
    badge = { text: 'Tamamı Ödendi', color: 'green', subtext: `${formatCurrency(totalPaidThisCycle)} ödendi` };
  } else if (remainingMinimumPayment <= 0 && totalPaidThisCycle > 0) {
    riskColor = 'yellow';
    badge = { text: 'Asgari Ödendi', color: 'yellow', subtext: `Kalan ekstre: ${formatCurrency(remainingStatementBalance)}` };
  } else if (isOverdue) {
    riskColor = 'red';
    badge = { text: `${overdueDays} Gün Gecikmiş`, color: 'red', subtext: 'Kritik Gecikme' };
  } else if (isLimitExceeded) {
    riskColor = 'red';
    badge = { text: 'Limit Aşımı', color: 'red', subtext: `${formatCurrency(limitExceededAmount)} aşıldı` };
  } else if (debt.type === 'overdraft' && utilizationRate >= 99) {
    riskColor = 'red';
    badge = { text: 'KMH %100 Dolu', color: 'red', subtext: 'Limit tükendi' };
  } else if (isHighUtilization) {
    riskColor = 'red';
    badge = { text: `Kritik Limit (%${utilizationRate.toFixed(1)})`, color: 'red' };
  } else if (daysUntilDue !== null && daysUntilDue <= 7 && daysUntilDue >= 0) {
    riskColor = 'orange';
    badge = { 
      text: daysUntilDue === 0 ? 'Bugün Son Gün' : `${daysUntilDue} Gün Kaldı`, 
      color: 'orange' 
    };
  } else if (daysUntilDue !== null && daysUntilDue <= 15 && daysUntilDue > 7) {
    riskColor = 'yellow';
    badge = { text: `${daysUntilDue} Gün Kaldı`, color: 'yellow' };
  } else if (isWarningUtilization) {
    riskColor = 'orange';
    badge = { text: `Yüksek Limit (%${utilizationRate.toFixed(1)})`, color: 'orange' };
  } else {
    riskColor = 'green';
    badge = { 
      text: daysUntilDue !== null ? `${daysUntilDue} Gün Kaldı` : 'Normal', 
      color: 'green' 
    };
  }

  return {
    debt,
    payments: debtPayments,
    totalPaidThisCycle,
    remainingStatementBalance,
    remainingMinimumPayment,
    effectiveCurrentBalance,
    effectiveAvailableLimit,
    utilizationRate,
    daysUntilDue,
    isOverdue,
    overdueDays,
    riskScore,
    riskColor,
    statusBadge: badge,
    isLimitExceeded,
    limitExceededAmount,
    isHighUtilization,
    isWarningUtilization,
  };
}

export function calculateFinancialHealth(
  debts: Debt[],
  payments: PaymentRecord[],
  baseDate: string = DEFAULT_APP_DATE
): FinancialHealthMetrics {
  const calculated = debts.map(d => calculateDebtStatus(d, payments, baseDate));

  let totalDebt = 0;
  let totalCreditCardDebt = 0;
  let totalKMHDebt = 0;
  let totalRestructuredDebt = 0;
  let thisMonthTotalToPay = 0;
  let thisMonthMinimumTotal = 0;
  let next7DaysTotal = 0;
  let next30DaysTotal = 0;
  let next60DaysTotal = 0;
  let next90DaysTotal = 0;

  let overdueCount = 0;
  let limitExceededCount = 0;
  let over90PercentCardsCount = 0;
  let over70PercentCardsCount = 0;
  let over90PercentKMHCount = 0;

  calculated.forEach(item => {
    const bal = item.effectiveCurrentBalance;
    totalDebt += bal;

    if (item.debt.type === 'credit_card' || item.debt.type === 'credit_card_installment') {
      totalCreditCardDebt += bal;
    } else if (item.debt.type === 'overdraft') {
      totalKMHDebt += bal;
    } else if (item.debt.is_restructured || item.debt.type.startsWith('restructured')) {
      totalRestructuredDebt += bal;
    }

    if (item.isOverdue) overdueCount++;
    if (item.isLimitExceeded) limitExceededCount++;

    if (item.debt.type === 'credit_card') {
      if (item.utilizationRate >= 90) over90PercentCardsCount++;
      else if (item.utilizationRate >= 70) over70PercentCardsCount++;
    } else if (item.debt.type === 'overdraft') {
      if (item.utilizationRate >= 90) over90PercentKMHCount++;
    }

    // Ödeme yükleri
    if (item.remainingStatementBalance > 0) {
      if (item.isOverdue || (item.daysUntilDue !== null && item.daysUntilDue <= 31)) {
        thisMonthTotalToPay += item.remainingStatementBalance;
        thisMonthMinimumTotal += item.remainingMinimumPayment;
      }

      if (item.isOverdue || (item.daysUntilDue !== null && item.daysUntilDue <= 7 && item.daysUntilDue >= 0)) {
        next7DaysTotal += item.remainingStatementBalance;
      }
      if (item.daysUntilDue !== null && item.daysUntilDue <= 30) {
        next30DaysTotal += item.remainingStatementBalance;
      }
      if (item.daysUntilDue !== null && item.daysUntilDue <= 60) {
        next60DaysTotal += item.remainingStatementBalance;
      }
      if (item.daysUntilDue !== null && item.daysUntilDue <= 90) {
        next90DaysTotal += item.remainingStatementBalance;
      }
    }
  });

  // Taksit projeksiyonu (önümüzdeki 30, 60, 90 gün içindeki aylık taksitler)
  debts.forEach(d => {
    if (d.monthly_installment && d.monthly_installment > 0) {
      // 60 ve 90 günlerdeki ek taksitleri de hesaba kat
      next60DaysTotal += d.monthly_installment;
      next90DaysTotal += d.monthly_installment * 2;
    }
  });

  // Kredi Notu Davranış Göstergeleri
  const paymentDiscipline: 'good' | 'warning' | 'risk' = 
    overdueCount > 0 ? 'risk' : (thisMonthMinimumTotal > 0 ? 'warning' : 'good');
  const paymentDisciplineReason = overdueCount > 0 
    ? `${overdueCount} adet gecikmiş borç bulunuyor! KKB kredi notunu en hızlı düşüren faktördür.` 
    : 'Gecikmiş ödeme bulunmuyor. Tüm ödemeler gününde izleniyor.';

  const limitUtilization: 'good' | 'warning' | 'risk' = 
    over90PercentCardsCount > 0 ? 'risk' : (over70PercentCardsCount > 0 ? 'warning' : 'good');
  const limitUtilizationReason = over90PercentCardsCount > 0
    ? `${over90PercentCardsCount} kartta limit doluluk oranı %90 üzerinde! Kredi puanını baskılar.`
    : over70PercentCardsCount > 0
    ? 'Kart limitleri %70-%90 bandında, dikkat edilmeli.'
    : 'Kart limit kullanımı dengeli seviyede.';

  const overdraftHealth: 'good' | 'warning' | 'risk' = 
    over90PercentKMHCount > 0 ? 'risk' : 'good';
  const overdraftHealthReason = over90PercentKMHCount > 0
    ? 'KMH / Esnek hesap %90 üzeri (veya tamamen) kullanılmış. Sürekli faiz işletir ve risk puanını artırır.'
    : 'KMH kullanımı güvenli seviyede.';

  const limitExcessHealth: 'good' | 'warning' | 'risk' = 
    limitExceededCount > 0 ? 'risk' : 'good';
  const limitExcessHealthReason = limitExceededCount > 0
    ? `${limitExceededCount} kartta limit aşımı tespit edildi. Acil limit altına çekilmeli.`
    : 'Limit aşımı bulunmuyor.';

  // Sıralı En Öncelikli Borç
  const sorted = [...calculated].sort((a, b) => b.riskScore - a.riskScore);
  const topPriorityDebt = sorted.length > 0 ? sorted[0] : null;

  // "Bugün Ne Yapmalıyım?" Eylem Listesi
  const topActionItems: FinancialHealthMetrics['topActionItems'] = [];

  // 1. Gecikmiş borçlar
  calculated.filter(c => c.isOverdue).forEach(c => {
    topActionItems.push({
      id: `act-overdue-${c.debt.id}`,
      debtId: c.debt.id,
      title: `${c.debt.bank} - ${c.debt.name} Ödemesi Gecikti!`,
      description: `${c.overdueDays} gündür gecikmede. Yasal takibe düşmemesi için en az ${formatCurrency(c.remainingMinimumPayment)} yatırılmalı.`,
      amount: c.remainingMinimumPayment,
      severity: 'critical',
    });
  });

  // 2. Limit aşımı
  calculated.filter(c => c.isLimitExceeded).forEach(c => {
    topActionItems.push({
      id: `act-overlimit-${c.debt.id}`,
      debtId: c.debt.id,
      title: `${c.debt.name} Limit Aşımını Düzelt`,
      description: `Limit ${formatCurrency(c.limitExceededAmount)} tutarında aşılmış. Ekstre faizinden ve puan kaybından kaçınmak için limit altına çekin.`,
      amount: c.limitExceededAmount,
      severity: 'critical',
    });
  });

  // 3. %100 KMH kullanımı
  calculated.filter(c => c.debt.type === 'overdraft' && c.utilizationRate >= 99).forEach(c => {
    topActionItems.push({
      id: `act-kmh-${c.debt.id}`,
      debtId: c.debt.id,
      title: `${c.debt.name} Hesabına Bakiye Aktar`,
      description: `KMH %100 dolu (${formatCurrency(c.effectiveCurrentBalance)}). Günlük bileşik faiz yükünü azaltmak için kısmi ödeme yapın.`,
      amount: 5000,
      severity: 'high',
    });
  });

  // 4. Yaklaşan acil ödemeler (7 gün içinde)
  calculated.filter(c => !c.isOverdue && c.daysUntilDue !== null && c.daysUntilDue <= 7 && c.remainingStatementBalance > 0).forEach(c => {
    topActionItems.push({
      id: `act-due-${c.debt.id}`,
      debtId: c.debt.id,
      title: `${c.debt.name} Son Ödemesi Yaklaşıyor (${c.daysUntilDue === 0 ? 'Bugün' : c.daysUntilDue + ' gün'})`,
      description: `Son ödeme ${formatDateTR(c.debt.due_date)}. Asgari: ${formatCurrency(c.remainingMinimumPayment)} | Kalan Ekstre: ${formatCurrency(c.remainingStatementBalance)}`,
      amount: c.remainingMinimumPayment,
      severity: c.daysUntilDue !== null && c.daysUntilDue <= 3 ? 'critical' : 'high',
    });
  });

  return {
    totalDebt,
    totalCreditCardDebt,
    totalKMHDebt,
    totalRestructuredDebt,
    thisMonthTotalToPay,
    thisMonthMinimumTotal,
    next7DaysTotal,
    next30DaysTotal,
    next60DaysTotal,
    next90DaysTotal,
    overdueCount,
    limitExceededCount,
    over90PercentCardsCount,
    over70PercentCardsCount,
    over90PercentKMHCount,
    behaviorScores: {
      paymentDiscipline,
      paymentDisciplineReason,
      limitUtilization,
      limitUtilizationReason,
      overdraftHealth,
      overdraftHealthReason,
      limitExcessHealth,
      limitExcessHealthReason,
    },
    topPriorityDebt,
    topActionItems,
  };
}
