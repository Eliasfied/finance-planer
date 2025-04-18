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
import { SavingsBudgetEntryService } from '../../../../services/savings-budget-entry.service';
import { SavingsBudgetEntry } from '../../../../interfaces/budget-entry.interface';

@Component({
  selector: 'app-edit-savings-budget-entry-modal',
  templateUrl: './edit-savings-budget-entry-modal.component.html',
  styleUrls: ['./edit-savings-budget-entry-modal.component.scss'],
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
export class EditSavingsBudgetEntryModalComponent extends BaseEditEntryModalComponent<SavingsBudgetEntry> {
  entryService = inject(SavingsBudgetEntryService);
  
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