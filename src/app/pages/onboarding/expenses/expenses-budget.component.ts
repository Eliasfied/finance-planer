import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BudgetEntryComponent } from '../../../components/budget-entry/budget-entry.component';
import { ExpenseBudgetEntryService } from '../../../services/expense-budget-entry.service';
import { AddExpenseBudgetEntryModalComponent } from './add-expense-modal/add-expense-budget-entry-modal.component';
import { EditExpenseBudgetEntryModalComponent } from './edit-expense-modal/edit-expense-budget-entry-modal.component';
import { add, chevronBack, chevronForward, car, tv, flash, restaurant, cart, gameController, fitness, airplane, school, apps, gameControllerOutline, home } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { ProgressDotsComponent } from '../../../components/progress-dots/progress-dots.component';
import { NavHeaderComponent } from '../../../components/nav-header/nav-header.component';
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
  <app-nav-header 
    [title]="'Expenses'" 
    [showPrevious]="true" 
    [showNext]="true"
    [previousRoute]="'/distribution-method'"
    [nextRoute]="'/investments-budget'">
  </app-nav-header>
    <app-budget-entry
      [pageTitle]="'Expenses'"
      [entryService]="expenseService"
      [entryType]="'expenses'"
      [addModalComponent]="addExpenseModalComponent"
      [editModalComponent]="editExpenseModalComponent"
      [categoryIcons]="categoryIcons">
    </app-budget-entry>
    <div class="page-navigation">
    <app-progress-dots [currentStep]=3></app-progress-dots>
  </div>
  `,
  styles: [],
  standalone: true,
  imports: [
    CommonModule,
    BudgetEntryComponent,
    ProgressDotsComponent,
    NavHeaderComponent
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