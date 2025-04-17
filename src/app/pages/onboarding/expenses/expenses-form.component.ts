import { Component, OnInit, inject, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IonContent, IonButton, IonIcon, IonCard, IonCardContent, IonFab, IonFabButton } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { add, chevronBack, chevronForward, car, tv, flash, restaurant, cart, gameController, fitness, airplane, school, apps, gameControllerOutline, home } from 'ionicons/icons';
import { ProgressDotsComponent } from '../../../components/progress-dots/progress-dots.component';
import { ExpenseService } from '../../../services/expense.service';
import { Expense } from '../../../models/expense.model';
import { ModalController } from '@ionic/angular/standalone';
import { AddExpenseModalComponent } from './add-expense-modal/add-expense-modal.component';
import { EditExpenseModalComponent } from './edit-expense-modal/edit-expense-modal.component';
import { IncomeService } from '../../../services/income.service';
import { DistributionMethodService } from '../../../services/distribution-method.service';

interface ExpenseCategory {
  name: string;
  icon: string;
  totalAmount: number;
  expenses: Expense[];
}

@Component({
  selector: 'app-expenses-form',
  templateUrl: './expenses-form.component.html',
  styleUrls: ['./expenses-form.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonButton,
    IonIcon,
    IonCard,
    IonCardContent,
    IonFab,
    IonFabButton,
    ProgressDotsComponent
  ]
})
export class ExpensesFormComponent implements OnInit {
  // Inject services using the inject function for cleaner code
  private router = inject(Router);
  private expenseService = inject(ExpenseService);
  private modalCtrl = inject(ModalController);
  private incomeService = inject(IncomeService);
  private distributionService = inject(DistributionMethodService);
  
  // UI state signals
  private isLoading = signal(false);
  
  // Categories signal to be grouped from expenses
  private categories = signal<ExpenseCategory[]>([]);
  
  // Expose read-only signals for the template
  expenseCategories = this.categories.asReadonly();
  
  // Computed values
  totalPlannedAmount = computed(() => 
    this.expenseService.totalMonthlyExpenses()
  );
  
  monthlyBudget = computed(() => {
    const totalIncome = this.incomeService.totalMonthlyIncome();
    const expensesPercentage = this.distributionService.expensesPercentage();
    return totalIncome * (expensesPercentage / 100);
  });
  
  leftToSpend = computed(() => 
    this.monthlyBudget() - this.totalPlannedAmount()
  );
  
  progressPercentage = computed(() => 
    this.monthlyBudget() > 0 ? (this.totalPlannedAmount() / this.monthlyBudget()) * 100 : 0
  );

  constructor() {
    addIcons({ add, chevronBack, chevronForward, car, apps, tv, flash, restaurant, cart, gameController, fitness, airplane, school, home, gameControllerOutline });
    
    // Add an effect to update categories whenever expenses change
    effect(() => {
      const expenses = this.expenseService.expenses();
      this.updateExpenseCategories(expenses);
    });
  }

  async ngOnInit() {
    // Force a refresh to ensure data is loaded
    await this.expenseService.forceRefresh();
  }

  // Update expense categories when expenses change
  private updateExpenseCategories(expenses: Expense[] = []) {
    if (!expenses || expenses.length === 0) {
      expenses = this.expenseService.expenses();
    }
    
    this.categories.set(this.groupExpensesByCategory(expenses));
  }

  private groupExpensesByCategory(expenses: Expense[]): ExpenseCategory[] {
    if (!expenses || expenses.length === 0) {
      return [];
    }
    
    const categoriesMap = new Map<string, ExpenseCategory>();
    
    expenses.forEach(expense => {
      if (!categoriesMap.has(expense.category)) {
        categoriesMap.set(expense.category, {
          name: expense.category,
          icon: this.getCategoryIcon(expense.category),
          totalAmount: 0,
          expenses: []
        });
      }
      
      const category = categoriesMap.get(expense.category)!;
      category.expenses.push(expense);
      category.totalAmount += this.transformAmountToMonthly(expense);
    });

    // Sort expenses within each category
    categoriesMap.forEach(category => {
      category.expenses.sort((a, b) => this.transformAmountToMonthly(b) - this.transformAmountToMonthly(a));
    });

    // Convert map to array and sort categories by total amount
    return Array.from(categoriesMap.values()).sort((a, b) => b.totalAmount - a.totalAmount);
  }

  public transformAmountToMonthly(expense: Expense): number {
    if (expense.billingTime === 'quarterly') {
      return expense.amount / 3;
    } else if (expense.billingTime === 'annually') {
      return expense.amount / 12;
    } else {
      return expense.amount;
    }
  }

  private getCategoryIcon(category: string): string {
    const iconMap: { [key: string]: string } = {
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
    return iconMap[category] || 'apps';
  }

  goToNext() {
    this.router.navigate(['/summary']);
  }

  goToPrevious() {
    this.router.navigate(['/distribution-method']);
  }

  async addNewExpense() {
    const modal = await this.modalCtrl.create({
      component: AddExpenseModalComponent
    });
    
    await modal.present();
    
    const { data } = await modal.onWillDismiss();
    if (data) {
      // The effect will update the categories automatically when the expense service signals are updated
    }
  }

  async onExpenseClick(expense: Expense) {
    const modal = await this.modalCtrl.create({
      component: EditExpenseModalComponent,
      componentProps: {
        expense: expense
      }
    });
    
    await modal.present();
    
    const { data } = await modal.onWillDismiss();
    if (data?.expense) {
      await this.expenseService.updateExpense(data.expense);
    } else if (data?.deleted) {
      // The effect will update the categories automatically
    }
  }
}
