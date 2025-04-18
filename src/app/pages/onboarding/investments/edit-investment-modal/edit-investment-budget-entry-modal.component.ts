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
import { InvestmentBudgetEntryService } from '../../../../services/investment-budget-entry.service';
import { InvestmentBudgetEntry } from '../../../../interfaces/budget-entry.interface';

@Component({
  selector: 'app-edit-investment-budget-entry-modal',
  templateUrl: './edit-investment-budget-entry-modal.component.html',
  styleUrls: ['./edit-investment-budget-entry-modal.component.scss'],
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
export class EditInvestmentBudgetEntryModalComponent extends BaseEditEntryModalComponent<InvestmentBudgetEntry> {
  entryService = inject(InvestmentBudgetEntryService);
  
  categories = [
    'Stocks',
    'ETFs',
    'Real Estate',
    'Crypto',
    'Bonds',
    'Retirement',
    'Precious Metals',
    'Other'
  ];
} 