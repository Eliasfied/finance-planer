import { Injectable, inject } from '@angular/core';
import { Firestore, collection, addDoc, getDocs, query, where, deleteDoc, doc } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { Expense } from 'src/app/models/expense.model';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  private firestore = inject(Firestore);
  private auth = inject(Auth);

  async addExpense(expense: Omit<Expense, 'id' | 'userId' | 'createdAt'>): Promise<string> {
    const userId = this.auth.currentUser?.uid;
    if (!userId) throw new Error('User not authenticated');

    const expenseData = {
      ...expense,
      userId,
      createdAt: new Date().toISOString()
    };

    const docRef = await addDoc(collection(this.firestore, 'expenses'), expenseData);
    return docRef.id;
  }

  async getExpenses(): Promise<Expense[]> {
    const userId = this.auth.currentUser?.uid;
    if (!userId) throw new Error('User not authenticated');

    const q = query(
      collection(this.firestore, 'expenses'),
      where('userId', '==', userId)
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Expense[];
  }

  async deleteExpense(expenseId: string): Promise<void> {
    await deleteDoc(doc(this.firestore, 'expenses', expenseId));
  }
} 