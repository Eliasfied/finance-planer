import { Injectable } from '@angular/core';
import { BudgetEntryService } from './budget-entry.service';
import { InvestmentBudgetEntry } from '../interfaces/budget-entry.interface';

@Injectable({
  providedIn: 'root'
})
export class InvestmentBudgetEntryService extends BudgetEntryService<InvestmentBudgetEntry> {
  protected collectionName = 'investments';
  
  // No need to override getMonthlyAmount as investments have a standard monthly amount
} 