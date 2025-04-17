import { Injectable, inject, signal, computed, effect } from '@angular/core';
import { Firestore, collection, addDoc, getDocs, query, where, deleteDoc, doc, getDoc, updateDoc } from '@angular/fire/firestore';
import { Auth, onAuthStateChanged, User } from '@angular/fire/auth';
import { Expense } from 'src/app/models/expense.model';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  private firestore = inject(Firestore);
  private auth = inject(Auth);
  
  // Private writable signals
  private _expenses = signal<Expense[]>([]);
  private currentUserId = signal<string | null>(null);
  
  // Public read-only signals
  public expenses = this._expenses.asReadonly();
  
  // Computed signal for monthly total expenses
  public totalMonthlyExpenses = computed(() => {
    return this._expenses().reduce((total, expense) => {
      return total + this.transformAmountToMonthly(expense);
    }, 0);
  });

  constructor() {
    // Effect to react to authentication changes
    effect(async () => {
      const userId = this.currentUserId();
      if (userId) {
        await this.loadExpenses(userId);
      } else {
        this._expenses.set([]);
      }
    });
    
    // Monitor auth state
    onAuthStateChanged(this.auth, (user: User | null) => {
      this.currentUserId.set(user ? user.uid : null);
    });
    
    // Initialize with current user if available
    if (this.auth.currentUser) {
      this.currentUserId.set(this.auth.currentUser.uid);
    }
  }
  
  // Transform expense amount to monthly value
  private transformAmountToMonthly(expense: Expense): number {
    if (expense.billingTime === 'quarterly') {
      return expense.amount / 3;
    } else if (expense.billingTime === 'annually') {
      return expense.amount / 12;
    } else {
      return expense.amount;
    }
  }
  
  // Load all expenses for current user
  private async loadExpenses(userId: string): Promise<void> {
    if (!userId) {
      this._expenses.set([]);
      return;
    }
    
    try {
      const q = query(
        collection(this.firestore, 'expenses'),
        where('userId', '==', userId)
      );
      
      const querySnapshot = await getDocs(q);
      const expenses = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Expense[];
      
      this._expenses.set(expenses);
    } catch (error) {
      console.error('Error loading expenses:', error);
      this._expenses.set([]);
    }
  }

  async addExpense(expense: Omit<Expense, 'id' | 'userId' | 'createdAt'>): Promise<string> {
    const userId = this.auth.currentUser?.uid;
    if (!userId) throw new Error('User not authenticated');

    const expenseData = {
      ...expense,
      userId,
      createdAt: new Date().toISOString()
    };

    try {
      const docRef = await addDoc(collection(this.firestore, 'expenses'), expenseData);
      
      // Reload expenses to update the signal
      await this.loadExpenses(userId);
      
      return docRef.id;
    } catch (error) {
      console.error('Error adding expense:', error);
      throw error;
    }
  }

  async getExpenses(): Promise<Expense[]> {
    const userId = this.auth.currentUser?.uid;
    if (!userId) throw new Error('User not authenticated');

    // Return the current value from the signal
    return this._expenses();
  }

  async getExpense(id: string): Promise<Expense | null> {
    const docRef = doc(this.firestore, 'expenses', id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as Expense : null;
  }

  async deleteExpense(expenseId: string): Promise<void> {
    const userId = this.auth.currentUser?.uid;
    if (!userId) throw new Error('User not authenticated');
    
    try {
      await deleteDoc(doc(this.firestore, 'expenses', expenseId));
      
      // Reload expenses to update the signal
      await this.loadExpenses(userId);
    } catch (error) {
      console.error('Error deleting expense:', error);
      throw error;
    }
  }

  async updateExpense(expense: Expense): Promise<void> {
    const userId = this.auth.currentUser?.uid;
    if (!userId) throw new Error('User not authenticated');
    
    try {
      const { id, ...expenseData } = expense;
      await updateDoc(doc(this.firestore, 'expenses', id), expenseData);
      
      // Reload expenses to update the signal
      await this.loadExpenses(userId);
    } catch (error) {
      console.error('Error updating expense:', error);
      throw error;
    }
  }
  
  // Manually trigger a reload of expenses - useful for component initialization
  public async forceRefresh(): Promise<void> {
    const userId = this.auth.currentUser?.uid;
    if (!userId) {
      return;
    }
    
    await this.loadExpenses(userId);
  }
} 