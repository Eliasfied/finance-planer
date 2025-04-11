export interface Expense {
  id: string;
  userId: string;
  category: string;
  billingTime: 'annual' | 'monthly' | 'quarterly';
  amount: number;
  name: string;
  billingDate: number;
  createdAt: string;
} 