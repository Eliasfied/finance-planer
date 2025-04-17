import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { 
  IonContent, 
  IonIcon, 
  IonInput, 
  IonSelect, 
  IonSelectOption, 
  IonText
} from '@ionic/angular/standalone';
import { BaseAddEntryModalComponent } from '../../../../components/budget-entry/modals/base-add-entry-modal.component';
import { ExpenseBudgetEntryService } from '../../../../services/expense-budget-entry.service';
import { ExpenseBudgetEntry } from '../../../../interfaces/budget-entry.interface';

@Component({
  selector: 'app-add-expense-budget-entry-modal',
  templateUrl: './add-expense-budget-entry-modal.component.html',
  styleUrls: ['./add-expense-budget-entry-modal.component.scss'],
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
export class AddExpenseBudgetEntryModalComponent extends BaseAddEntryModalComponent<ExpenseBudgetEntry> {
  entryService = inject(ExpenseBudgetEntryService);
  
  entry: Omit<ExpenseBudgetEntry, 'id' | 'userId' | 'createdAt'> = {
    name: '',
    category: '',
    amount: 0,
    billingTime: 'monthly',
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
} 