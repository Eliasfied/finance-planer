import { Injectable } from '@angular/core';
import { Firestore, doc, setDoc, getDoc, updateDoc } from '@angular/fire/firestore';
import { FinancialData, FinancialEntry } from '../models/financial-data.interface';
import { Income } from '../interfaces/income.interface';

@Injectable({
  providedIn: 'root'
})
export class FinancialDataService {
  constructor(private firestore: Firestore) {}

  private async ensureFinancialDataExists(userId: string): Promise<FinancialData> {
    const data = await this.getFinancialData(userId);
    
    if (!data) {
      await this.createFinancialData(userId);
      const newData = await this.getFinancialData(userId);
      if (!newData) {
        throw new Error('Failed to create financial data');
      }
      return newData;
    }
    
    return data;
  }

  async createFinancialData(userId: string): Promise<void> {
    const initialData: FinancialData = {
      uid: userId,
      expensesPercentageValue: 0,
      investmentsPercentageValue: 0,
      savingsPercentageValue: 0,
      incomes: [],
      expenses: [],
      investments: [],
      savings: [],
      lastUpdated: new Date()
    };

    await setDoc(doc(this.firestore, 'financialData', userId), initialData);
  }

  async getFinancialData(userId: string): Promise<FinancialData | null> {
    try {
      const docRef = doc(this.firestore, 'financialData', userId);
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? docSnap.data() as FinancialData : null;
    } catch (error) {
      console.error('Error getting financial data:', error);
      throw error;
    }
  }

  async addIncome(userId: string, income: Income): Promise<void> {
    try {
      const docRef = doc(this.firestore, 'financialData', userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        // Document exists, update it
        const data = docSnap.data() as FinancialData;
        const incomes = data.incomes || [];
        await updateDoc(docRef, {
          incomes: [...incomes, income],
          lastUpdated: new Date()
        });
      } else {
        // Document doesn't exist, create it
        await setDoc(docRef, {
          incomes: [income],
          lastUpdated: new Date()
        });
      }
    } catch (error) {
      console.error('Error adding income:', error);
      throw error;
    }
  }

  async addDistributionValues(userId: string, expensePercentage: number, investmentPercentage: number, savingsPercentage: number): Promise<void> {
    const docRef = doc(this.firestore, 'financialData', userId);
    
    await updateDoc(docRef, {
      expensesPercentageValue: expensePercentage,
      investmentsPercentageValue: investmentPercentage,
      savingsPercentageValue: savingsPercentage,
      lastUpdated: new Date()
    });
  }

  async addExpense(userId: string, expense: FinancialEntry): Promise<void> {
    const docRef = doc(this.firestore, 'financialData', userId);
    const data = await this.ensureFinancialDataExists(userId);
    
    const updatedExpenses = [...data.expenses, expense];
    
    await updateDoc(docRef, {
      expenses: updatedExpenses,
      lastUpdated: new Date()
    });
  }

  async addInvestment(userId: string, investment: FinancialEntry): Promise<void> {
    const docRef = doc(this.firestore, 'financialData', userId);
    const data = await this.ensureFinancialDataExists(userId);
    
    const updatedInvestments = [...data.investments, investment];
    
    await updateDoc(docRef, {
      investments: updatedInvestments,
      lastUpdated: new Date()
    });
  }

  async addSaving(userId: string, saving: FinancialEntry): Promise<void> {
    const docRef = doc(this.firestore, 'financialData', userId);
    const data = await this.ensureFinancialDataExists(userId);
    
    const updatedSavings = [...data.savings, saving];
    
    await updateDoc(docRef, {
      savings: updatedSavings,
      lastUpdated: new Date()
    });
  }

  async removeEntry(userId: string, field: 'incomes' | 'expenses' | 'investments' | 'savings', index: number): Promise<void> {
    try {
      const docRef = doc(this.firestore, 'financialData', userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data() as FinancialData;
        const entries = [...(data[field] || [])];
        entries.splice(index, 1);
        await updateDoc(docRef, { 
          [field]: entries,
          lastUpdated: new Date()
        });
      }
    } catch (error) {
      console.error('Error removing entry:', error);
      throw error;
    }
  }
} 