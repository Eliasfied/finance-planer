export interface FinancialEntry {
  name: string;
  amount: number;
}

export interface FinancialData {
  uid: string;
  // Total values
  expensesValue: number;
  investmentsValue: number;
  savingsValue: number;
  
  // Lists of entries
  incomes: FinancialEntry[];
  expenses: FinancialEntry[];
  investments: FinancialEntry[];
  savings: FinancialEntry[];
  
  // Metadata
  lastUpdated: Date;
} 