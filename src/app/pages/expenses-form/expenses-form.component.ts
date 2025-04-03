import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon, IonCard, IonCardContent, IonProgressBar, IonFab, IonFabButton } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { add, chevronBack, chevronForward, car, tvOutline } from 'ionicons/icons';
import { ProgressDotsComponent } from '../../components/progress-dots/progress-dots.component';

interface ExpenseCategory {
  id: string;
  name: string;
  icon: string;
  totalAmount: number;
  expenses: Expense[];
}

interface Expense {
  id: string;
  name: string;
  amount: number;
}

@Component({
  selector: 'app-expenses-form',
  templateUrl: './expenses-form.component.html',
  styleUrls: ['./expenses-form.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButton,
    IonIcon,
    IonCard,
    IonCardContent,
    IonProgressBar,
    IonFab,
    IonFabButton,
    ProgressDotsComponent
  ]
})
export class ExpensesFormComponent implements OnInit {
  totalPlannedAmount: number = 1850;
  monthlyBudget: number = 2500;
  leftToSpend: number = 550;

  expenseCategories: ExpenseCategory[] = [
    {
      id: '1',
      name: 'Car & Transport',
      icon: 'car',
      totalAmount: 700,
      expenses: [
        { id: '1', name: 'Car insurance', amount: 350 },
        { id: '2', name: 'Repair & Service', amount: 200 },
        { id: '3', name: 'Gas', amount: 150 }
      ]
    },
    {
      id: '2',
      name: 'Subscriptions',
      icon: 'tv-outline',
      totalAmount: 60,
      expenses: [
        { id: '4', name: 'Netflix', amount: 25 },
        { id: '5', name: 'Amazon Prime', amount: 20 },
        { id: '6', name: 'Disney+', amount: 15 }
      ]
    }
  ];

  constructor(private router: Router) {
    addIcons({ add, chevronBack, chevronForward, car, tvOutline });
  }

  ngOnInit() {}

  goToNext() {
    this.router.navigate(['/summary']);
  }

  goToPrevious() {
    this.router.navigate(['/finance-method']);
  }

  getProgressPercentage(): number {
    return (this.totalPlannedAmount / this.monthlyBudget) * 100;
  }

  addNewExpense() {
    // TODO: Implement add new expense logic
  }
}
