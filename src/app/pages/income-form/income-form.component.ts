import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { trashOutline, arrowForwardOutline } from 'ionicons/icons';
import { Router } from '@angular/router';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import { FinancialDataService } from '../../services/financial-data.service';
import { FinancialEntry } from '../../models/financial-data.interface';
import { ProgressDotsComponent } from '../../components/progress-dots/progress-dots.component';

// Register the icons
addIcons({ trashOutline, arrowForwardOutline });

@Component({
  selector: 'app-income-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IonicModule, ProgressDotsComponent],
  templateUrl: './income-form.component.html',
  styleUrls: ['./income-form.component.scss']
})
export class IncomeFormComponent implements OnInit {
  incomeForm: FormGroup;
  currentUserId: string | null = null;
  isSubmitting = false;
  savedIncomes: FinancialEntry[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private auth: Auth,
    private financialDataService: FinancialDataService
  ) {
    this.incomeForm = this.fb.group({
      source: ['', Validators.required],
      amount: [null, [Validators.required, Validators.min(0)]]
    });

    // Get current user
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.currentUserId = user.uid;
        this.loadSavedIncomes();
      } else {
        console.error('No user logged in');
        this.router.navigate(['/login']);
      }
    });
  }

  async ngOnInit() {
    if (this.currentUserId) {
      await this.loadSavedIncomes();
    }
  }

  async loadSavedIncomes() {
    if (!this.currentUserId) return;
    try {
      const data = await this.financialDataService.getFinancialData(this.currentUserId);
      this.savedIncomes = data?.incomes || [];
    } catch (error) {
      console.error('Error loading incomes:', error);
    }
  }

  async onSubmit() {
    if (!this.currentUserId) {
      console.error('No user logged in');
      this.router.navigate(['/finance-method']);
      return;
    }

    if (this.incomeForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      try {
        const incomeEntry: FinancialEntry = {
          name: this.incomeForm.get('source')?.value,
          amount: Number(this.incomeForm.get('amount')?.value)
        };

        // Save the income entry
        await this.financialDataService.addIncome(this.currentUserId, incomeEntry);
        console.log('Saved income entry:', incomeEntry);

        // Add to local array
        this.savedIncomes.push(incomeEntry);

        // Reset the form
        this.incomeForm.reset();
      } catch (error) {
        console.error('Error saving income:', error);
      } finally {
        this.isSubmitting = false;
      }
    }
  }

  async removeIncome(index: number) {
    if (!this.currentUserId) return;
    try {
      await this.financialDataService.removeEntry(this.currentUserId, 'incomes', index);
      this.savedIncomes.splice(index, 1);
    } catch (error) {
      console.error('Error removing income:', error);
    }
  }

  continueToNext() {
    this.router.navigate(['/finance-method']);
  }

  navigateBack() {
    this.router.navigate(['/welcome']);
  }
} 