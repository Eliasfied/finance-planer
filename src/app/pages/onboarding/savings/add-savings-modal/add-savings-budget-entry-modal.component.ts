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
import { SavingsBudgetEntryService } from '../../../../services/savings-budget-entry.service';
import { SavingsBudgetEntry } from '../../../../interfaces/budget-entry.interface';

@Component({
  selector: 'app-add-savings-budget-entry-modal',
  templateUrl: './add-savings-budget-entry-modal.component.html',
  styleUrls: ['./add-savings-budget-entry-modal.component.scss'],
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
export class AddSavingsBudgetEntryModalComponent extends BaseAddEntryModalComponent<SavingsBudgetEntry> {
  entryService = inject(SavingsBudgetEntryService);
  
  entry: Omit<SavingsBudgetEntry, 'id' | 'userId' | 'createdAt'> = {
    name: '',
    category: '',
    amount: 0,
    billingDate: 1,
    account: ''
  };

  categories = [
    'Emergency Fund',
    'Vacation',
    'Major Purchase',
    'Down Payment',
    'Wedding',
    'Education',
    'Holiday',
    'Other'
  ];
} 