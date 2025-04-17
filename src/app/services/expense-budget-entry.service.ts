import { Injectable } from '@angular/core';
import { BudgetEntryService } from './budget-entry.service';
import { ExpenseBudgetEntry } from '../interfaces/budget-entry.interface';

@Injectable({
  providedIn: 'root'
})
export class ExpenseBudgetEntryService extends BudgetEntryService<ExpenseBudgetEntry> {
  protected collectionName = 'expenses';
  
  // Overrides the default method to account for billing time
  public override getMonthlyAmount(item: ExpenseBudgetEntry): number {
    if (item.billingTime === 'quarterly') {
      return item.amount / 3;
    } else if (item.billingTime === 'annually') {
      return item.amount / 12;
    } else {
      return item.amount;
    }
  }
} 