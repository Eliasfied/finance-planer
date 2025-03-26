import { Injectable } from '@angular/core';
import { Firestore, doc, setDoc, getDoc, updateDoc } from '@angular/fire/firestore';
import { FinancialData, FinancialEntry } from '../models/financial-data.interface';

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
      expensesValue: 0,
      investmentsValue: 0,
      savingsValue: 0,
      incomes: [],
      expenses: [],
      investments: [],
      savings: [],
      lastUpdated: new Date()
    };

    await setDoc(doc(this.firestore, 'financialData', userId), initialData);
  }

  async getFinancialData(userId: string): Promise<FinancialData | null> {
    const docRef = doc(this.firestore, 'financialData', userId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data() as FinancialData;
    }
    return null;
  }

  async addIncome(userId: string, income: FinancialEntry): Promise<void> {
    const docRef = doc(this.firestore, 'financialData', userId);
    const data = await this.ensureFinancialDataExists(userId);
    
    const updatedIncomes = [...data.incomes, income];
    await updateDoc(docRef, {
      incomes: updatedIncomes,
      lastUpdated: new Date()
    });
  }

  async addExpense(userId: string, expense: FinancialEntry): Promise<void> {
    const docRef = doc(this.firestore, 'financialData', userId);
    const data = await this.ensureFinancialDataExists(userId);
    
    const updatedExpenses = [...data.expenses, expense];
    const newExpensesValue = data.expensesValue + expense.amount;
    
    await updateDoc(docRef, {
      expenses: updatedExpenses,
      expensesValue: newExpensesValue,
      lastUpdated: new Date()
    });
  }

  async addInvestment(userId: string, investment: FinancialEntry): Promise<void> {
    const docRef = doc(this.firestore, 'financialData', userId);
    const data = await this.ensureFinancialDataExists(userId);
    
    const updatedInvestments = [...data.investments, investment];
    const newInvestmentsValue = data.investmentsValue + investment.amount;
    
    await updateDoc(docRef, {
      investments: updatedInvestments,
      investmentsValue: newInvestmentsValue,
      lastUpdated: new Date()
    });
  }

  async addSaving(userId: string, saving: FinancialEntry): Promise<void> {
    const docRef = doc(this.firestore, 'financialData', userId);
    const data = await this.ensureFinancialDataExists(userId);
    
    const updatedSavings = [...data.savings, saving];
    const newSavingsValue = data.savingsValue + saving.amount;
    
    await updateDoc(docRef, {
      savings: updatedSavings,
      savingsValue: newSavingsValue,
      lastUpdated: new Date()
    });
  }

  async removeEntry(userId: string, type: 'incomes' | 'expenses' | 'investments' | 'savings', index: number): Promise<void> {
    const docRef = doc(this.firestore, 'financialData', userId);
    const data = await this.ensureFinancialDataExists(userId);
    
    const updatedEntries = [...data[type]];
    const removedEntry = updatedEntries.splice(index, 1)[0];
    
    const update: any = {
      [type]: updatedEntries,
      lastUpdated: new Date()
    };

    // Update the corresponding value field
    if (type === 'expenses') {
      update.expensesValue = data.expensesValue - removedEntry.amount;
    } else if (type === 'investments') {
      update.investmentsValue = data.investmentsValue - removedEntry.amount;
    } else if (type === 'savings') {
      update.savingsValue = data.savingsValue - removedEntry.amount;
    }

    await updateDoc(docRef, update);
  }
} 