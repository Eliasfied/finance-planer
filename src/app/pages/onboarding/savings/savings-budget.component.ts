import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BudgetEntryComponent } from '../../../components/budget-entry/budget-entry.component';
import { SavingsBudgetEntryService } from '../../../services/savings-budget-entry.service';
import { AddSavingsBudgetEntryModalComponent } from './add-savings-modal/add-savings-budget-entry-modal.component';
import { EditSavingsBudgetEntryModalComponent } from './edit-savings-modal/edit-savings-budget-entry-modal.component';
import { add, chevronBack, chevronForward, walletOutline, umbrella, card, heartCircleOutline, cashOutline, wallet, saveOutline, shield, home, bookOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';

// Register the icons
addIcons({ 
  add, 
  chevronBack, 
  chevronForward, 
  walletOutline, 
  umbrella, 
  card, 
  heartCircleOutline, 
  cashOutline, 
  wallet, 
  saveOutline, 
  shield,
  home,
  bookOutline
});


@Component({
  selector: 'app-savings-budget',
  template: `
    <app-budget-entry
      [pageTitle]="'Savings'"
      [currentStep]="5"
      [previousRoute]="'/investments-budget'"
      [nextRoute]="'/savings-form'"
      [entryService]="savingsService"
      [entryType]="'savings'"
      [addModalComponent]="addSavingsModalComponent"
      [editModalComponent]="editSavingsModalComponent"
      [categoryIcons]="categoryIcons">
    </app-budget-entry>
  `,
  styles: [],
  standalone: true,
  imports: [
    CommonModule,
    BudgetEntryComponent
  ]
})
export class SavingsBudgetComponent {
  savingsService = inject(SavingsBudgetEntryService);
  addSavingsModalComponent = AddSavingsBudgetEntryModalComponent;
  editSavingsModalComponent = EditSavingsBudgetEntryModalComponent;
  
  // Icons for the different categories
  categoryIcons = {
    'Emergency Fund': 'umbrella',
    'Vacation': 'wallet-outline',
    'Major Purchase': 'card',
    'Down Payment': 'home',
    'Wedding': 'heart-circle-outline',
    'Education': 'book-outline',
    'Holiday': 'cash-outline',
    'Other': 'wallet'
  };
} 