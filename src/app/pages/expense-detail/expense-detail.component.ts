import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { IonContent, IonIcon, IonText, IonCard, IonCardContent, IonSpinner } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBack, trashOutline } from 'ionicons/icons';
import { ExpenseService } from '../../services/expense.service';

@Component({
  selector: 'app-expense-detail',
  templateUrl: './expense-detail.component.html',
  styleUrls: ['./expense-detail.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonIcon,
    IonText,
    IonCard,
    IonCardContent,
    IonSpinner
  ]
})
export class ExpenseDetailComponent implements OnInit {
  expense: any;
  isLoading: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private expenseService: ExpenseService
  ) {
    addIcons({ arrowBack, trashOutline });
  }

  async ngOnInit() {
    this.isLoading = true;
    try {
      const expenseId = this.route.snapshot.paramMap.get('id');
      if (expenseId) {
        this.expense = await this.expenseService.getExpense(expenseId);
        console.log(expenseId);
        console.log(this.expense);
        if (!this.expense) {
          // Handle case where expense is not found
          this.router.navigate(['/expenses-form']);
        }
      }
    } catch (error) {
      console.error('Error loading expense:', error);
    } finally {
      this.isLoading = false;
    }
  }

  onEdit() {
    this.router.navigate(['/expense', this.expense.id, 'edit']);
  }

  navigateBack() {
    this.router.navigate(['/expenses-form']);
  }

  async deleteExpense() {
    try {
      await this.expenseService.deleteExpense(this.expense.id);
      this.navigateBack();
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  }
} 