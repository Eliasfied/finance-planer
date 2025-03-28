import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { Income } from '../../interfaces/income.interface';
import { IncomeService } from '../../services/income.service';
import { addIcons } from 'ionicons';
import { arrowBack, trashOutline } from 'ionicons/icons';
import { Subscription } from 'rxjs';

// Register Ionicons
addIcons({ arrowBack, trashOutline });

@Component({
  selector: 'app-income-detail',
  templateUrl: './income-detail.component.html',
  styleUrls: ['./income-detail.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class IncomeDetailComponent implements OnInit, OnDestroy {
  income: Income | null = null;
  isLoading = true;
  private incomeId: string | null = null;
  private incomeChangesSub?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private incomeService: IncomeService
  ) {}

  async ngOnInit() {
    this.incomeId = this.route.snapshot.paramMap.get('id');
    if (!this.incomeId) {
      this.router.navigate(['/income-form']);
      return;
    }

    await this.loadIncomeDetails();

    // Subscribe to income changes
    this.incomeChangesSub = this.incomeService.incomeChanges$.subscribe(() => {
      this.loadIncomeDetails();
    });
  }

  ngOnDestroy() {
    if (this.incomeChangesSub) {
      this.incomeChangesSub.unsubscribe();
    }
  }

  private async loadIncomeDetails() {
    if (!this.incomeId) return;

    try {
      this.income = await this.incomeService.getIncome(this.incomeId);
      this.isLoading = false;
    } catch (error) {
      console.error('Error loading income:', error);
      this.isLoading = false;
    }
  }

  navigateBack() {
    this.router.navigate(['/income-form']);
  }

  async onEdit() {
    if (this.income) {
      this.router.navigate(['/income', this.income.id, 'edit']);
    }
  }

  async deleteIncome() {
    if (!this.income) return;

    try {
      await this.incomeService.removeIncome(this.income.id);
      this.router.navigate(['/income-form']);
    } catch (error) {
      console.error('Error deleting income:', error);
    }
  }
} 