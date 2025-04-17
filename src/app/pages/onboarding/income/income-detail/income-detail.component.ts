import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { Income } from 'src/app/interfaces/income.interface';
import { IncomeService } from 'src/app/services/income.service';
import { addIcons } from 'ionicons';
import { arrowBack, trashOutline, createOutline } from 'ionicons/icons';

// Register Ionicons
addIcons({ arrowBack, trashOutline, createOutline });

@Component({
  selector: 'app-income-detail',
  templateUrl: './income-detail.component.html',
  styleUrls: ['./income-detail.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class IncomeDetailComponent implements OnInit {
  income: Income | null = null;
  isLoading = true;
  private incomeId: string | null = null;

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private incomeService = inject(IncomeService);

  async ngOnInit() {
    this.incomeId = this.route.snapshot.paramMap.get('id');
    if (!this.incomeId) {
      console.error('Income ID not found in route parameters.');
      this.router.navigate(['/income-form']);
      return;
    }

    await this.loadIncomeDetails();
  }

  private async loadIncomeDetails() {
    if (!this.incomeId) return;

    this.isLoading = true;
    try {
      this.income = await this.incomeService.getIncome(this.incomeId);
      if (!this.income) {
        console.warn(`Income with ID ${this.incomeId} not found.`);
      }
    } catch (error) {
      console.error('Error loading income details:', error);
    } finally {
      this.isLoading = false;
    }
  }

  navigateBack() {
    this.router.navigate(['/income-form']);
  }

  onEdit() {
    if (this.incomeId) {
      this.router.navigate(['/income', this.incomeId, 'edit']);
    } else {
      console.error('Cannot edit: Income ID is missing.');
    }
  }

  async deleteIncome() {
    if (!this.incomeId) {
      console.error('Cannot delete: Income ID is missing.');
      return;
    }

    try {
      await this.incomeService.removeIncome(this.incomeId);
      this.router.navigate(['/income-form']);
    } catch (error) {
      console.error('Error deleting income:', error);
    }
  }
} 