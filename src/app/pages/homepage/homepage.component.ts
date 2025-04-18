import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { IncomeService } from '../../services/income.service';
import { ExpenseBudgetEntryService } from '../../services/expense-budget-entry.service';
import { SavingsBudgetEntryService } from '../../services/savings-budget-entry.service';
import { InvestmentBudgetEntryService } from '../../services/investment-budget-entry.service';
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

  // Chart data
  chartData = signal<{name: string, value: number, color: string}[]>([]);
  
  // Budget status
  budgetStatus = computed(() => {
    return {
      expenses: {
        planned: this.expenseService.totalMonthlyAmount(),
        actual: 0, // This would come from actual spending tracking
        isOverBudget: false
      },
      savings: {
        planned: this.savingsService.totalMonthlyAmount(),
        actual: 0, // This would come from actual savings tracking
        isOverBudget: false
      },
      investments: {
        planned: this.investmentService.totalMonthlyAmount(),
        actual: 0, // This would come from actual investment tracking
        isOverBudget: false
      }
    };
  });

  // Total amounts
  totalIncome = computed(() => this.incomeService.totalMonthlyIncome());
  
  ngOnInit(): void {
    this.updateChartData();
  }

  private updateChartData(): void {
    // In a real app, we would fetch actual data here
    // For now, using planned amounts as examples
    const income = this.incomeService.totalMonthlyIncome();
    const expenses = this.expenseService.totalMonthlyAmount();
    const savings = this.savingsService.totalMonthlyAmount();
    const investments = this.investmentService.totalMonthlyAmount();
    const remaining = Math.max(0, income - expenses - savings - investments);

    // Create array of categories
    const items = [
      { name: 'Expenses', value: expenses, color: '#FF6B6B' },
      { name: 'Savings', value: savings, color: '#4ECDC4' },
      { name: 'Investments', value: investments, color: '#7A77FF' },
      { name: 'Remaining', value: remaining, color: '#FFD166' }
    ];

    // Sort by value, largest first (for the percentage display)
    items.sort((a, b) => b.value - a.value);

    this.chartData.set(items);
  }

  // Helper method for chart offset calculation
  calculateOffset(index: number): number {
    if (index === 0) {
      return 0;
    }
    
    let offset = 0;
    const income = this.totalIncome();
    
    if (income <= 0) {
      return 0;
    }
    
    for (let i = 0; i < index; i++) {
      offset += (this.chartData()[i].value / income) * 283;
    }
    
    return -1 * offset;
  }
  
  // Helper method for dash array calculation
  calculateDashArray(value: number): string {
    const income = this.totalIncome();
    if (income <= 0) {
      return '0 283';
    }
    return ((value / income) * 283) + ' 283';
  }

  navigateTo(path: string): void {
    this.router.navigateByUrl(path);
  }
} 