import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { IncomeService } from '../../services/income.service';
import { ExpenseBudgetEntryService } from '../../services/expense-budget-entry.service';
import { SavingsBudgetEntryService } from '../../services/savings-budget-entry.service';
import { InvestmentBudgetEntryService } from '../../services/investment-budget-entry.service';
import { DistributionMethodService } from '../../services/distribution-method.service';
import { computed, signal } from '@angular/core';
import { addIcons } from 'ionicons';
import { 
  personCircleOutline, 
  notificationsOutline, 
  chatbubbleOutline,
  arrowUpOutline, 
  arrowDownOutline, 
  swapHorizontalOutline, 
  ellipsisHorizontal,
  homeOutline,
  home,
  personOutline,
  cartOutline,
  saveOutline,
  trendingUpOutline,
  walletOutline,
  settingsOutline,
  addOutline,
  searchOutline,
  informationOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class HomepageComponent implements OnInit {
  private router = inject(Router);
  private incomeService = inject(IncomeService);
  private expenseService = inject(ExpenseBudgetEntryService);
  private savingsService = inject(SavingsBudgetEntryService);
  private investmentService = inject(InvestmentBudgetEntryService);
  public distributionService = inject(DistributionMethodService);

  constructor() {
    // Register icons
    addIcons({
      personCircleOutline, 
      notificationsOutline, 
      chatbubbleOutline,
      arrowUpOutline, 
      arrowDownOutline, 
      swapHorizontalOutline, 
      ellipsisHorizontal,
      homeOutline,
      home,
      personOutline,
      cartOutline,
      saveOutline,
      trendingUpOutline,
      walletOutline,
      settingsOutline,
      addOutline,
      searchOutline,
      informationOutline
    });
  }

  
  // Budget status
  budgetStatus = computed(() => {
    const totalIncome = this.incomeService.totalMonthlyIncome();
    
    // Get distribution percentages from service
    const expensesPercent = this.distributionService.expensesPercentage() / 100;
    const savingsPercent = this.distributionService.savingsPercentage() / 100;
    const investmentsPercent = this.distributionService.investmentsPercentage() / 100;
    
    // Calculate budgets based on income and distribution percentages
    const expensesBudget = totalIncome * expensesPercent;
    const savingsBudget = totalIncome * savingsPercent;
    const investmentsBudget = totalIncome * investmentsPercent;
    
    // Get the actual planned amounts from the budget services
    const expensesPlanned = this.expenseService.totalMonthlyAmount();
    const savingsPlanned = this.savingsService.totalMonthlyAmount();
    const investmentsPlanned = this.investmentService.totalMonthlyAmount();
    
    // Calculate how much of the budget is spent so far (actual planned values)
    // As a percentage of the allocated budget based on distribution
    const expensesPercUsed = expensesPlanned / expensesBudget * 100;
    const savingsPercUsed = savingsPlanned / savingsBudget * 100;
    const investmentsPercUsed = investmentsPlanned / investmentsBudget * 100;
    
    return {
      expenses: {
        planned: expensesBudget,
        actual: expensesPlanned,
        remaining: expensesBudget - expensesPlanned,
        percent: expensesPercUsed,
        isOverBudget: expensesPlanned > expensesBudget
      },
      savings: {
        planned: savingsBudget,
        actual: savingsPlanned,
        remaining: savingsBudget - savingsPlanned,
        percent: savingsPercUsed,
        isOverBudget: savingsPlanned > savingsBudget
      },
      investments: {
        planned: investmentsBudget,
        actual: investmentsPlanned,
        remaining: investmentsBudget - investmentsPlanned,
        percent: investmentsPercUsed,
        isOverBudget: investmentsPlanned > investmentsBudget
      }
    };
  });

  // Total amounts
  totalIncome = computed(() => this.incomeService.totalMonthlyIncome());
  
  ngOnInit(): void {
  }
}
