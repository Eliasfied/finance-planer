export interface BaseBudgetEntry {
  id: string;
  userId: string;
  name: string;
  category: string;
  amount: number;
  createdAt: string;
  billingDate: number;

}

export interface EntryCategory<T> {
  name: string;
  icon: string;
  totalAmount: number;
  entries: T[];
}

// Expense extends BaseBudgetEntry with specific fields
export interface ExpenseBudgetEntry extends BaseBudgetEntry {
  billingTime: 'annually' | 'monthly' | 'quarterly';
}

// Investment extends BaseBudgetEntry with specific fields
export interface InvestmentBudgetEntry extends BaseBudgetEntry {
  expectedReturnRate?: number;
  account: string;
}

// Savings extends BaseBudgetEntry with specific fields
export interface SavingsBudgetEntry extends BaseBudgetEntry {
  account: string;

} 