import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BudgetEntryComponent } from '../../../components/budget-entry/budget-entry.component';
import { ExpenseBudgetEntryService } from '../../../services/expense-budget-entry.service';
import { AddExpenseBudgetEntryModalComponent } from './add-expense-modal/add-expense-budget-entry-modal.component';
import { EditExpenseBudgetEntryModalComponent } from './edit-expense-modal/edit-expense-budget-entry-modal.component';
import { add, chevronBack, chevronForward, car, tv, flash, restaurant, cart, gameController, fitness, airplane, school, apps, gameControllerOutline, home } from 'ionicons/icons';
import { addIcons } from 'ionicons';

// Register the icons
addIcons({ 
  add, 
  chevronBack, 
  chevronForward, 
  car, tv, flash, restaurant, cart, gameController, fitness, airplane, school, apps, gameControllerOutline, home
});


@Component({
  selector: 'app-expenses-budget',
  template: `
    <app-budget-entry
      [pageTitle]="'Expenses'"
      [currentStep]="3"
      [previousRoute]="'/distribution-method'"
      [nextRoute]="'/expenses-form'"
      [entryService]="expenseService"
      [entryType]="'expenses'"
      [addModalComponent]="addExpenseModalComponent"
      [editModalComponent]="editExpenseModalComponent"
      [categoryIcons]="categoryIcons">
    </app-budget-entry>
  `,
  styles: [],
  standalone: true,
  imports: [
    CommonModule,
    BudgetEntryComponent
  ]
})
export class ExpensesBudgetComponent {
  expenseService = inject(ExpenseBudgetEntryService);
  addExpenseModalComponent = AddExpenseBudgetEntryModalComponent;
  editExpenseModalComponent = EditExpenseBudgetEntryModalComponent;
  
  // Icons for the different categories
  categoryIcons = {
    'Home': 'home',
    'Car & Transport': 'car',
    'Subscriptions': 'tv',
    'Bills & Utilities': 'flash',
    'Food & Dining': 'restaurant',
    'Shopping': 'cart',
    'Entertainment': 'game-controller',
    'Health & Fitness': 'fitness',
    'Travel': 'airplane',
    'Education': 'school',
    'Other': 'apps'
  };
} 