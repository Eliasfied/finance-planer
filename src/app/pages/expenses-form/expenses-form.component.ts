import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon, IonCard, IonCardContent, IonProgressBar, IonFab, IonFabButton } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { add, chevronBack, chevronForward, car, tvOutline } from 'ionicons/icons';
import { ProgressDotsComponent } from '../../components/progress-dots/progress-dots.component';
import { ExpenseService } from '../../services/expense.service';
import { Expense } from '../../models/expense.model';
import { ModalController } from '@ionic/angular/standalone';
import { AddExpenseModalComponent } from '../../components/add-expense-modal/add-expense-modal.component';

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
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButton,
    IonIcon,
    IonCard,
    IonCardContent,
    IonProgressBar,
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
    addIcons({ add, chevronBack, chevronForward, car, tvOutline });
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
      category.totalAmount += expense.amount;
    });

    return Array.from(categoriesMap.values());
  }

  private getCategoryIcon(category: string): string {
    const iconMap: { [key: string]: string } = {
      'Car & Transport': 'car',
      'Subscriptions': 'tv-outline',
      'Bills & Utilities': 'flash-outline',
      'Food & Dining': 'restaurant-outline',
      'Shopping': 'cart-outline',
      'Entertainment': 'game-controller-outline',
      'Health & Fitness': 'fitness-outline',
      'Travel': 'airplane-outline',
      'Education': 'school-outline',
      'Other': 'apps-outline'
    };
    return iconMap[category] || 'apps-outline';
  }

  private calculateTotals() {
    this.totalPlannedAmount = this.expenseCategories.reduce((total, category) => total + category.totalAmount, 0);
    this.leftToSpend = this.monthlyBudget - this.totalPlannedAmount;
  }

  goToNext() {
    this.router.navigate(['/summary']);
  }

  goToPrevious() {
    this.router.navigate(['/finance-method']);
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
}
