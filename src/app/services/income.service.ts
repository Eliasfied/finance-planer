import { Injectable } from '@angular/core';
import { Firestore, collection, doc, getDocs, addDoc, deleteDoc, query, where, getDoc, updateDoc } from '@angular/fire/firestore';
import { Income } from '../interfaces/income.interface';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IncomeService {
  private incomeChanges = new Subject<void>();
  incomeChanges$ = this.incomeChanges.asObservable();

  constructor(private firestore: Firestore) {}

  async getIncomes(userId: string): Promise<Income[]> {
    try {
      const q = query(collection(this.firestore, 'incomes'), where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      
      const incomes = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Income[];

      // Sort incomes by amount in descending order
      return incomes.sort((a, b) => b.amount - a.amount);
    } catch (error) {
      console.error('Error getting incomes:', error);
      throw error;
    }
  }

  async getIncome(id: string): Promise<Income | null> {
    try {
      const docRef = doc(this.firestore, 'incomes', id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data()
        } as Income;
      }
      return null;
    } catch (error) {
      console.error('Error getting income:', error);
      throw error;
    }
  }

  async addIncome(userId: string, income: Omit<Income, 'id'>): Promise<void> {
    try {
      const incomesRef = collection(this.firestore, 'incomes');
      await addDoc(incomesRef, {
        ...income,
        userId,
        createdAt: new Date()
      });
    } catch (error) {
      console.error('Error adding income:', error);
      throw error;
    }
  }

  async updateIncome(income: Income): Promise<void> {
    try {
      const docRef = doc(this.firestore, 'incomes', income.id);
      const { id, ...updateData } = income;
      await updateDoc(docRef, {
        ...updateData,
        updatedAt: new Date()
      });
      this.incomeChanges.next();
    } catch (error) {
      console.error('Error updating income:', error);
      throw error;
    }
  }

  async removeIncome(incomeId: string): Promise<void> {
    try {
      const docRef = doc(this.firestore, 'incomes', incomeId);
      await deleteDoc(docRef);
      this.incomeChanges.next();
    } catch (error) {
      console.error('Error removing income:', error);
      throw error;
    }
  }
} 