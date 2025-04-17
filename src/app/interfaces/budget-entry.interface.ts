export interface BaseBudgetEntry {
  id: string;
  userId: string;
  name: string;
  category: string;
  amount: number;
  createdAt: string;
}

export interface EntryCategory<T> {
  name: string;
  icon: string;
  totalAmount: number;
  entries: T[];
}

// Expense erweitert BaseBudgetEntry mit speziellen Feldern
export interface ExpenseBudgetEntry extends BaseBudgetEntry {
  billingTime: 'annually' | 'monthly' | 'quarterly';
  billingDate: number;
}

// Investment erweitert BaseBudgetEntry mit speziellen Feldern
export interface InvestmentBudgetEntry extends BaseBudgetEntry {
  type: 'stocks' | 'crypto' | 'real-estate' | 'bonds' | 'etf' | 'other';
  riskLevel: 'low' | 'medium' | 'high';
  expectedReturnRate?: number;
}

// Savings erweitert BaseBudgetEntry mit speziellen Feldern
export interface SavingsBudgetEntry extends BaseBudgetEntry {
  goal: string;
  targetAmount?: number;
  targetDate?: string;
} 