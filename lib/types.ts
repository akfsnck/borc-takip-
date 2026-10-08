export type DebtType = 
  | 'credit_card'
  | 'credit_card_installment'
  | 'overdraft'
  | 'restructured_overdraft'
  | 'restructured_credit_card'
  | 'loan'
  | 'other';

export type PaymentType = 
  | 'minimum'
  | 'statement_full'
  | 'installment'
  | 'partial'
  | 'close_debt'
  | 'other';

export interface PaymentRecord {
  id: string;
  debt_id: string;
  amount: number;
  payment_date: string; // YYYY-MM-DD
  payment_type: PaymentType;
  note?: string;
  receipt_url?: string;
  created_at: string;
}

export interface Debt {
  id: string;
  user_id?: string;
  name: string;
  type: DebtType;
  bank: string;
  last_four?: string;
  
  // Kredi Kartı & KMH limit bilgileri
  credit_limit?: number;
  current_balance?: number;       // Güncel borç
  statement_balance?: number;     // Kesilen son ekstre borcu
  minimum_payment?: number;       // Asgari ödeme tutarı
  available_limit?: number;       // Kullanılabilir limit
  
  // Tarihler (YYYY-MM-DD)
  statement_date?: string;        // Hesap kesim tarihi
  due_date?: string;              // Son ödeme tarihi
  
  // Taksit & Yapılandırma alanları
  principal?: number;             // Ana para
  total_repayment?: number;       // Toplam geri ödeme tutarı
  monthly_installment?: number;   // Aylık taksit
  total_installments?: number;    // Toplam taksit adedi
  paid_installments?: number;     // Ödenen taksit
  remaining_installments?: number;// Kalan taksit
  first_due_date?: string;        // İlk taksit tarihi
  transaction_date?: string;      // İşlem tarihi
  due_day?: number;               // Her ayın kaçıncı günü (örn. 23)
  statement_day?: number;         // Her ayın kaçıncı günü
  
  // KMH özel
  overdraft_limit?: number;       // KMH Limiti
  used_amount?: number;           // Kullanılan KMH tutarı
  interest_rate?: number;         // Faiz oranı %
  
  // Durum ve notlar
  note?: string;
  is_restructured?: boolean;
  has_auto_payment?: boolean;
  status?: 'active' | 'closed' | 'delinquent';
  created_at: string;
  updated_at: string;
}

export interface CalculatedDebtStatus {
  debt: Debt;
  payments: PaymentRecord[];
  totalPaidThisCycle: number;
  
  // Dinamik bakiyeler
  remainingStatementBalance: number;
  remainingMinimumPayment: number;
  effectiveCurrentBalance: number;
  effectiveAvailableLimit: number;
  
  // Oranlar
  utilizationRate: number; // 0 - 100+ %
  
  // Tarih ve gecikme
  daysUntilDue: number | null; // eksi ise gecikmiş
  isOverdue: boolean;
  overdueDays: number;
  
  // Risk & Renk
  riskScore: number;
  riskColor: 'red' | 'orange' | 'yellow' | 'green';
  statusBadge: {
    text: string;
    color: 'red' | 'orange' | 'yellow' | 'green' | 'blue';
    subtext?: string;
  };
  
  // Uyarı etiketleri
  isLimitExceeded: boolean;
  limitExceededAmount: number;
  isHighUtilization: boolean; // > 90%
  isWarningUtilization: boolean; // 70-90%
}

export interface FinancialHealthMetrics {
  totalDebt: number;
  totalCreditCardDebt: number;
  totalKMHDebt: number;
  totalRestructuredDebt: number;
  thisMonthTotalToPay: number;
  thisMonthMinimumTotal: number;
  next7DaysTotal: number;
  next30DaysTotal: number;
  next60DaysTotal: number;
  next90DaysTotal: number;
  
  // Sayıcılar
  overdueCount: number;
  limitExceededCount: number;
  over90PercentCardsCount: number;
  over70PercentCardsCount: number;
  over90PercentKMHCount: number;
  
  // Kredi notu davranışı göstergeleri
  behaviorScores: {
    paymentDiscipline: 'good' | 'warning' | 'risk';
    paymentDisciplineReason: string;
    limitUtilization: 'good' | 'warning' | 'risk';
    limitUtilizationReason: string;
    overdraftHealth: 'good' | 'warning' | 'risk';
    overdraftHealthReason: string;
    limitExcessHealth: 'good' | 'warning' | 'risk';
    limitExcessHealthReason: string;
  };
  
  // Öncelik motoru önerisi
  topPriorityDebt: CalculatedDebtStatus | null;
  topActionItems: Array<{
    id: string;
    title: string;
    description: string;
    amount?: number;
    severity: 'critical' | 'high' | 'medium';
    debtId?: string;
  }>;
}
