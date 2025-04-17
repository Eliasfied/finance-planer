export interface DistributionMethod {
  id?: string;
  userId: string;
  expenses: number;
  investments: number;
  savings: number;
  createdAt?: Date;
  updatedAt?: Date;
} 