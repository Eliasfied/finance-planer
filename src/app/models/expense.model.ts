export interface Expense {
  id: string;
  userId: string;
  category: string;
  billingTime: 'annually' | 'monthly' | 'quarterly';
  amount: number;
  name: string;
  billingDate: number;
  createdAt: string;
} 