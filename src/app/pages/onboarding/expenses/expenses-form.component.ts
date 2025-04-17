import { Component, OnInit } from '@angular/core';
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
  totalPlannedAmount: number = 0;
  monthlyBudget: number = 2500;
  leftToSpend: number = 2500;

  expenseCategories: ExpenseCategory[] = [];

  constructor(
    private router: Router,
    private expenseService: ExpenseService,
    private modalCtrl: ModalController
  ) {
    addIcons({ add, chevronBack, chevronForward, car, apps, tv, flash, restaurant, cart , gameController, fitness, airplane, school, home, gameControllerOutline });
  }

  async ngOnInit() {
    await this.loadExpenses();
  }

  async loadExpenses() {
    try {
      const expenses = await this.expenseService.getExpenses();
      this.expenseCategories = this.groupExpensesByCategory(expenses);
      this.calculateTotals();
    } catch (error) {
      console.error('Error loading expenses:', error);
    }
  }

  private groupExpensesByCategory(expenses: Expense[]): ExpenseCategory[] {
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
      return expense.amount / 4;
    } else if (expense.billingTime === 'annually') {
      return expense.amount / 12;
    } 
  else {
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

  private calculateTotals() {
    this.totalPlannedAmount = this.expenseCategories.reduce((total, category) => total + category.totalAmount, 0);
    this.leftToSpend = this.monthlyBudget - this.totalPlannedAmount;
  }

  goToNext() {
    this.router.navigate(['/summary']);
  }

  goToPrevious() {
    this.router.navigate(['/distribution-method']);
  }

  getProgressPercentage(): number {
    return (this.totalPlannedAmount / this.monthlyBudget) * 100;
  }

  async addNewExpense() {
    const modal = await this.modalCtrl.create({
      component: AddExpenseModalComponent
    });
    
    await modal.present();
    
    const { data } = await modal.onWillDismiss();
    if (data) {
      await this.loadExpenses();
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
      await this.loadExpenses();
    } else if (data?.deleted) {
      await this.loadExpenses();
    }
  }
}
