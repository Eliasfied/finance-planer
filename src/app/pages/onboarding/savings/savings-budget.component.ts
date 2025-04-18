import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BudgetEntryComponent } from '../../../components/budget-entry/budget-entry.component';
import { SavingsBudgetEntryService } from '../../../services/savings-budget-entry.service';
import { AddSavingsBudgetEntryModalComponent } from './add-savings-modal/add-savings-budget-entry-modal.component';
import { EditSavingsBudgetEntryModalComponent } from './edit-savings-modal/edit-savings-budget-entry-modal.component';
import { add, chevronBack, chevronForward, walletOutline, umbrella, card, heartCircleOutline, cashOutline, wallet, saveOutline, shield, home, bookOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { ProgressDotsComponent } from '../../../components/progress-dots/progress-dots.component';
import { NavHeaderComponent } from '../../../components/nav-header/nav-header.component';
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
  <app-nav-header 
    [title]="'Savings'" 
    [showPrevious]="true" 
    [showNext]="true"
    [previousRoute]="'/investments-budget'"
    [nextRoute]="'/login'">
  </app-nav-header>
    <app-budget-entry
      [pageTitle]="'Savings'"
      [entryService]="savingsService"
      [entryType]="'savings'"
      [addModalComponent]="addSavingsModalComponent"
      [editModalComponent]="editSavingsModalComponent"
      [categoryIcons]="categoryIcons">
    </app-budget-entry>
    <div class="page-navigation">
    <app-progress-dots [currentStep]=5></app-progress-dots>
  </div>
  `,
  styles: [],
  standalone: true,
  imports: [
    CommonModule,
    BudgetEntryComponent,
    ProgressDotsComponent,
    NavHeaderComponent
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