import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, 
  IonIcon, 
  IonInput, 
  IonSelect, 
  IonSelectOption, 
  IonText
} from '@ionic/angular/standalone';
import { ModalController } from '@ionic/angular/standalone';
import { ExpenseService } from '../../services/expense.service';
import { Expense } from '../../models/expense.model';

@Component({
  selector: 'app-add-expense-modal',
  templateUrl: './add-expense-modal.component.html',
  styleUrls: ['./add-expense-modal.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonIcon,
    IonInput,
    IonSelect,
    IonSelectOption,
    IonText
  ]
})
export class AddExpenseModalComponent {
  private modalCtrl = inject(ModalController);
  private expenseService = inject(ExpenseService);

  expense: Omit<Expense, 'id' | 'userId' | 'createdAt'> = {
    name: '',
    category: '',
    billingTime: 'monthly',
    amount: 0,
    billingDate: 1
  };

  categories = [
    'Home',
    'Car & Transport',
    'Subscriptions',
    'Bills & Utilities',
    'Food & Dining',
    'Shopping',
    'Entertainment',
    'Health & Fitness',
    'Travel',
    'Education',
    'Other'
  ];

  async addExpense() {
    try {
      await this.expenseService.addExpense(this.expense);
      this.modalCtrl.dismiss(true);
    } catch (error) {
      console.error('Error adding expense:', error);
    }
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }
} 