import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { 
  IonContent, 
  IonIcon, 
  IonInput, 
  IonSelect, 
  IonSelectOption, 
  IonText,
  IonButton
} from '@ionic/angular/standalone';
import { BaseEditEntryModalComponent } from '../../../../components/budget-entry/modals/base-edit-entry-modal.component';
import { ExpenseBudgetEntryService } from '../../../../services/expense-budget-entry.service';
import { ExpenseBudgetEntry } from '../../../../interfaces/budget-entry.interface';

@Component({
  selector: 'app-edit-expense-budget-entry-modal',
  templateUrl: './edit-expense-budget-entry-modal.component.html',
  styleUrls: ['./edit-expense-budget-entry-modal.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonIcon,
    IonInput,
    IonSelect,
    IonSelectOption,
    IonText,
    IonButton
  ]
})
export class EditExpenseBudgetEntryModalComponent extends BaseEditEntryModalComponent<ExpenseBudgetEntry> {
  entryService = inject(ExpenseBudgetEntryService);
  
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