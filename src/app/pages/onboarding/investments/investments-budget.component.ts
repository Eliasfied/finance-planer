import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BudgetEntryComponent } from '../../../components/budget-entry/budget-entry.component';
import { InvestmentBudgetEntryService } from '../../../services/investment-budget-entry.service';
import { AddInvestmentBudgetEntryModalComponent } from './add-investment-modal/add-investment-budget-entry-modal.component';
import { EditInvestmentBudgetEntryModalComponent } from './edit-investment-modal/edit-investment-budget-entry-modal.component';
import { add, chevronBack, chevronForward, cashOutline, statsChartOutline, logoUsd, businessOutline, logoEuro, logoAppleAppstore, logoApple, logoAmazon, logoWindows, logoCodepen, buildOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { ProgressDotsComponent } from '../../../components/progress-dots/progress-dots.component';
import { NavHeaderComponent } from '../../../components/nav-header/nav-header.component';
// Register the icons
addIcons({ 
  add, 
  chevronBack, 
  chevronForward, 
  cashOutline, 
  statsChartOutline, 
  logoUsd, 
  businessOutline, 
  logoEuro, 
  logoAppleAppstore, 
  logoApple, 
  logoAmazon, 
  logoWindows, 
  logoCodepen, 
  buildOutline
});


@Component({
  selector: 'app-investments-budget',
  template: `
    <app-nav-header 
    [title]="'Investments'" 
    [showPrevious]="true" 
    [showNext]="true"
    [previousRoute]="'/expenses-budget'"
    [nextRoute]="'/savings-budget'">
  </app-nav-header>
    <app-budget-entry
      [pageTitle]="'Investments'"
      [entryService]="investmentService"
      [entryType]="'investments'"
      [addModalComponent]="addInvestmentModalComponent"
      [editModalComponent]="editInvestmentModalComponent"
      [categoryIcons]="categoryIcons">
    </app-budget-entry>
    <div class="page-navigation">
    <app-progress-dots [currentStep]=4></app-progress-dots>
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
export class InvestmentsBudgetComponent {
  investmentService = inject(InvestmentBudgetEntryService);
  addInvestmentModalComponent = AddInvestmentBudgetEntryModalComponent;
  editInvestmentModalComponent = EditInvestmentBudgetEntryModalComponent;
  
  // Icons for the different categories
  categoryIcons = {
    'Stocks': 'stats-chart-outline',
    'ETFs': 'logo-usd',
    'Real Estate': 'business-outline',
    'Crypto': 'logo-euro',
    'Bonds': 'cash-outline',
    'Retirement': 'build-outline',
    'Precious Metals': 'logo-codepen',
    'Other': 'logo-apple-appstore'
  };
} 