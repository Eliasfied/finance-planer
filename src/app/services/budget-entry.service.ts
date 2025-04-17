import { inject, signal, computed, effect } from '@angular/core';
import { Firestore, collection, addDoc, getDocs, query, where, deleteDoc, doc, getDoc, updateDoc } from '@angular/fire/firestore';
import { Auth, onAuthStateChanged, User } from '@angular/fire/auth';
import { BaseBudgetEntry } from '../interfaces/budget-entry.interface';

export abstract class BudgetEntryService<T extends BaseBudgetEntry> {
  protected firestore = inject(Firestore);
  protected auth = inject(Auth);
  
  // Abstract property for collection name
  protected abstract collectionName: string;
  
  // Private signals
  protected _items = signal<T[]>([]);
  protected currentUserId = signal<string | null>(null);
  
  // Public signals
  public items = this._items.asReadonly();
  
  // Computed signals
  public totalMonthlyAmount = computed(() => {
    return this._items().reduce((total, item) => {
      return total + this.getMonthlyAmount(item);
    }, 0);
  });

  // Public method for monthly amounts (used by components)
  public getMonthlyAmount(item: T): number {
    return item.amount; // Default implementation (can be overridden)
  }

  constructor() {
    // Effect for authentication changes
    effect(async () => {
      const userId = this.currentUserId();
      if (userId) {
        await this.loadItems(userId);
      } else {
        this._items.set([]);
      }
    });
    
    // Monitor auth status
    onAuthStateChanged(this.auth, (user: User | null) => {
      this.currentUserId.set(user ? user.uid : null);
    });
    
    // Initialize with current user
    if (this.auth.currentUser) {
      this.currentUserId.set(this.auth.currentUser.uid);
    }
  }
  
  // Load items
  protected async loadItems(userId: string): Promise<void> {
    if (!userId) {
      this._items.set([]);
      return;
    }
    
    try {
      const q = query(
        collection(this.firestore, this.collectionName),
        where('userId', '==', userId)
      );
      
      const querySnapshot = await getDocs(q);
      const items = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as T[];
      
      this._items.set(items);
    } catch (error) {
      console.error(`Error loading ${this.collectionName}:`, error);
      this._items.set([]);
    }
  }

  // Add item
  async addItem(item: Omit<T, 'id' | 'userId' | 'createdAt'>): Promise<string> {
    const userId = this.auth.currentUser?.uid;
    if (!userId) throw new Error('User not authenticated');

    const itemData = {
      ...item,
      userId,
      createdAt: new Date().toISOString()
    };

    try {
      const docRef = await addDoc(collection(this.firestore, this.collectionName), itemData);
      
      // Reload items to update the signal
      await this.loadItems(userId);
      
      return docRef.id;
    } catch (error) {
      console.error(`Error adding ${this.collectionName}:`, error);
      throw error;
    }
  }

  // Get item
  async getItem(id: string): Promise<T | null> {
    const docRef = doc(this.firestore, this.collectionName, id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as T : null;
  }

  // Update item
  async updateItem(item: T): Promise<void> {
    const userId = this.auth.currentUser?.uid;
    if (!userId) throw new Error('User not authenticated');
    
    try {
      const { id, ...itemData } = item;
      await updateDoc(doc(this.firestore, this.collectionName, id), itemData);
      
      // Reload items to update the signal
      await this.loadItems(userId);
    } catch (error) {
      console.error(`Error updating ${this.collectionName}:`, error);
      throw error;
    }
  }

  // Delete item
  async deleteItem(id: string): Promise<void> {
    const userId = this.auth.currentUser?.uid;
    if (!userId) throw new Error('User not authenticated');
    
    try {
      await deleteDoc(doc(this.firestore, this.collectionName, id));
      
      // Reload items to update the signal
      await this.loadItems(userId);
    } catch (error) {
      console.error(`Error deleting ${this.collectionName}:`, error);
      throw error;
    }
  }
  
  // Manual refresh
  public async forceRefresh(): Promise<void> {
    const userId = this.auth.currentUser?.uid;
    if (!userId) {
      return;
    }
    
    await this.loadItems(userId);
  }
} 