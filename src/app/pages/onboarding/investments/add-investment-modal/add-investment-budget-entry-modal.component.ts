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
import { InvestmentBudgetEntryService } from '../../../../services/investment-budget-entry.service';
import { InvestmentBudgetEntry } from '../../../../interfaces/budget-entry.interface';

@Component({
  selector: 'app-add-investment-budget-entry-modal',
  templateUrl: './add-investment-budget-entry-modal.component.html',
  styleUrls: ['./add-investment-budget-entry-modal.component.scss'],
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
export class AddInvestmentBudgetEntryModalComponent extends BaseAddEntryModalComponent<InvestmentBudgetEntry> {
  entryService = inject(InvestmentBudgetEntryService);
  
  entry: Omit<InvestmentBudgetEntry, 'id' | 'userId' | 'createdAt'> = {
    name: '',
    category: '',
    amount: 0,
    billingDate: 1,
    account: ''
  };

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

  investmentTypes = [
    'stocks',
    'crypto',
    'real-estate',
    'bonds',
    'etf',
    'other'
  ];
} 