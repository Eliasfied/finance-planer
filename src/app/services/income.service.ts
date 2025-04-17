import { Injectable, signal, computed, effect, inject, WritableSignal } from '@angular/core';
import { Firestore, collection, query, where, getDocs, getDoc, addDoc, updateDoc, deleteDoc, doc, orderBy } from '@angular/fire/firestore';
import { Auth, onAuthStateChanged, User } from '@angular/fire/auth';
import { Income } from 'src/app/interfaces/income.interface';

@Injectable({
  providedIn: 'root'
})
export class IncomeService {
  private firestore: Firestore = inject(Firestore);
  private auth: Auth = inject(Auth);

  private _savedIncomes: WritableSignal<Income[]> = signal([]);
  private currentUserId = signal<string | null>(null);

  // Public read-only signal for components
  public savedIncomes = this._savedIncomes.asReadonly();

  // Computed signal for the total income
  public totalMonthlyIncome = computed(() => {
    return this._savedIncomes().reduce((total, income) => total + income.amount, 0);
  });

  constructor() {
    // Effect to react to authentication changes and load/clear data
    effect(async () => {
      const user = this.currentUserId();
      if (user) {
        await this.loadIncomes(user);
      } else {
        this._savedIncomes.set([]); 
      }
    });

    // Monitor auth state
    onAuthStateChanged(this.auth, (user: User | null) => {
      this.currentUserId.set(user ? user.uid : null);
    });
  }

  // Loads incomes for the given user and updates the signal
  private async loadIncomes(userId: string): Promise<void> {
    if (!userId) {
      this._savedIncomes.set([]);
      return;
    }
    try {
      const q = query(
        collection(this.firestore, 'incomes'),
        where('userId', '==', userId)
      );
      const querySnapshot = await getDocs(q);
      const incomes = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Income[];

      // Sort the incomes client-side by amount descending
      const sortedIncomes = incomes.sort((a, b) => b.amount - a.amount);

      this._savedIncomes.set(sortedIncomes); 
    } catch (error) {
      console.error('Error loading incomes:', error);
      this._savedIncomes.set([]); 
    }
  }

  // Fetches a single income document - useful for detail views maybe
  async getIncome(id: string): Promise<Income | null> {
    try {
      const docRef = doc(this.firestore, 'incomes', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Income;
      }
      return null;
    } catch (error) {
      console.error('Error getting single income:', error);
      throw error;
    }
  }

  // Adds a new income document
  async addIncome(income: Omit<Income, 'id' | 'userId'>): Promise<void> {
    const userId = this.currentUserId();
    if (!userId) {
      throw new Error('User not logged in');
    }
    try {
      const incomesRef = collection(this.firestore, 'incomes');
      // We only need name, type, amount from the input
      const { name, type, amount } = income;
      await addDoc(incomesRef, {
        name,
        type,
        amount,
        userId: userId,
        createdAt: new Date()
      });
      await this.loadIncomes(userId);
    } catch (error) {
      console.error('Error adding income:', error);
      throw error;
    }
  }

  // Updates an existing income document
  async updateIncome(income: Income): Promise<void> {
    const userId = this.currentUserId();
     if (!userId || userId !== income.userId) {
       console.warn('Attempt to update income for mismatching user or when not logged in.');
       throw new Error('User mismatch or not logged in');
     }
    try {
      const docRef = doc(this.firestore, 'incomes', income.id);
      // Exclude id and userId from the update payload for safety
      const { id, userId: incomeUserId, ...updateData } = income;
      await updateDoc(docRef, {
        ...updateData,
        updatedAt: new Date()
      });
      await this.loadIncomes(userId);
    } catch (error) {
      console.error('Error updating income:', error);
      throw error;
    }
  }

  // Removes an income document
  async removeIncome(incomeId: string): Promise<void> {
     const userId = this.currentUserId();
     if (!userId) {
        console.warn('Attempt to remove income when not logged in.');
       throw new Error('User not logged in');
     }
    try {
      const docRef = doc(this.firestore, 'incomes', incomeId);
      await deleteDoc(docRef);
      await this.loadIncomes(userId);
    } catch (error) {
      console.error('Error removing income:', error);
      throw error;
    }
  }
} 