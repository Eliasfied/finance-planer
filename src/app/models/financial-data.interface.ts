export interface FinancialEntry {
  name: string;
  amount: number;
}

export interface FinancialData {
  // User ID
  uid: string;
  // Total values
  expensesPercentageValue: number;
  investmentsPercentageValue: number;
  savingsPercentageValue: number;
  
  // Lists of entries
  incomes: FinancialEntry[];
  expenses: FinancialEntry[];
  investments: FinancialEntry[];
  savings: FinancialEntry[];
  
  // Metadata
  lastUpdated: Date;
} 