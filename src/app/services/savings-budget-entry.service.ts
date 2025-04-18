import { Injectable } from '@angular/core';
import { BudgetEntryService } from './budget-entry.service';
import { SavingsBudgetEntry } from '../interfaces/budget-entry.interface';

@Injectable({
  providedIn: 'root'
})
export class SavingsBudgetEntryService extends BudgetEntryService<SavingsBudgetEntry> {
  protected collectionName = 'savings';
  
  // No need to override getMonthlyAmount as savings have a standard monthly amount
} 