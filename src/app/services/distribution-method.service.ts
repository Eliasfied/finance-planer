import { Injectable, signal, computed, effect, inject, WritableSignal } from '@angular/core';
import { Firestore, collection, query, where, getDocs, getDoc, addDoc, updateDoc, deleteDoc, doc, orderBy, limit } from '@angular/fire/firestore';
import { Auth, onAuthStateChanged, User } from '@angular/fire/auth';
import { DistributionMethod } from 'src/app/interfaces/distribution-method.interface';

@Injectable({
  providedIn: 'root'
})
export class DistributionMethodService {
  private firestore: Firestore = inject(Firestore);
  private auth: Auth = inject(Auth);

  private _distributionMethod: WritableSignal<DistributionMethod | null> = signal(null);
  private currentUserId = signal<string | null>(null);

  // Public read-only signal for components
  public distributionMethod = this._distributionMethod.asReadonly();

  // Default values for a new distribution method
  private defaultValues = {
    expenses: 75,
    investments: 15,
    savings: 10
  };

  // Computed signals for individual percentages
  public expensesPercentage = computed(() => this._distributionMethod()?.expenses ?? this.defaultValues.expenses);
  public investmentsPercentage = computed(() => this._distributionMethod()?.investments ?? this.defaultValues.investments);
  public savingsPercentage = computed(() => this._distributionMethod()?.savings ?? this.defaultValues.savings);

  constructor() {
    // Effect to react to authentication changes and load/clear data
    effect(async () => {
      const user = this.currentUserId();
      if (user) {
        await this.loadDistributionMethod(user);
      } else {
        this._distributionMethod.set(null);
      }
    });

    // Monitor auth state
    onAuthStateChanged(this.auth, (user: User | null) => {
      this.currentUserId.set(user ? user.uid : null);
    });
  }

  // Loads the distribution method for the given user
  private async loadDistributionMethod(userId: string): Promise<void> {
    if (!userId) {
      this._distributionMethod.set(null);
      return;
    }
    try {
      // Try to find an existing distribution method for the user
      const q = query(
        collection(this.firestore, 'distributionMethods'),
        where('userId', '==', userId),
        limit(1) // We only need the most recent one if there are multiple
      );
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        // Use the first distribution method found
        const doc = querySnapshot.docs[0];
        const distributionMethod = {
          id: doc.id,
          ...doc.data()
        } as DistributionMethod;
        
        this._distributionMethod.set(distributionMethod);
      } else {
        // No distribution method found for this user
        this._distributionMethod.set(null);
      }
    } catch (error) {
      console.error('Error loading distribution method:', error);
      this._distributionMethod.set(null);
    }
  }

  // Creates or updates a distribution method for the current user
  async saveDistributionMethod(values: Omit<DistributionMethod, 'id' | 'userId'>): Promise<void> {
    const userId = this.currentUserId();
    if (!userId) {
      throw new Error('User not logged in');
    }

    // Validate that the percentages add up to 100
    const { expenses, investments, savings } = values;
    if (expenses + investments + savings !== 100) {
      throw new Error('Distribution percentages must add up to 100%');
    }

    try {
      const currentMethod = this._distributionMethod();
      
      if (currentMethod && currentMethod.id) {
        // Update existing distribution method
        const docRef = doc(this.firestore, 'distributionMethods', currentMethod.id);
        await updateDoc(docRef, {
          ...values,
          updatedAt: new Date()
        });
      } else {
        // Create a new distribution method
        const docRef = collection(this.firestore, 'distributionMethods');
        await addDoc(docRef, {
          ...values,
          userId,
          createdAt: new Date()
        });
      }
      
      // Reload the data to update the signal
      await this.loadDistributionMethod(userId);
    } catch (error) {
      console.error('Error saving distribution method:', error);
      throw error;
    }
  }

  // Use or create the default distribution method
  async useDefaultMethod(): Promise<void> {
    return this.saveDistributionMethod(this.defaultValues);
  }

  // Delete the current distribution method
  async deleteDistributionMethod(): Promise<void> {
    const userId = this.currentUserId();
    const currentMethod = this._distributionMethod();
    
    if (!userId || !currentMethod || !currentMethod.id) {
      throw new Error('No distribution method to delete or user not logged in');
    }
    
    try {
      const docRef = doc(this.firestore, 'distributionMethods', currentMethod.id);
      await deleteDoc(docRef);
      this._distributionMethod.set(null);
    } catch (error) {
      console.error('Error deleting distribution method:', error);
      throw error;
    }
  }
} 