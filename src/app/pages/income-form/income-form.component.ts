import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import { Income } from '../../interfaces/income.interface';
import { ProgressDotsComponent } from '../../components/progress-dots/progress-dots.component';
import { IncomeService } from '../../services/income.service';
import { addIcons } from 'ionicons';
import { 
  businessOutline,
  add,
  arrowBackOutline
} from 'ionicons/icons';
import { Subscription } from 'rxjs';

// Register Ionicons
addIcons({
  businessOutline,
  add,
  arrowBackOutline
});

@Component({
  selector: 'app-income-form',
  templateUrl: './income-form.component.html',
  styleUrls: ['./income-form.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, ReactiveFormsModule, ProgressDotsComponent]
})
export class IncomeFormComponent implements OnInit, OnDestroy {
  incomeForm: FormGroup;
  savedIncomes: Income[] = [];
  currentUserId: string | null = null;
  isSubmitting = false;
  private incomeChangesSub?: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private auth: Auth,
    private incomeService: IncomeService
  ) {
    this.incomeForm = this.formBuilder.group({
      name: ['', Validators.required],
      type: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(0)]]
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

    // Subscribe to income changes
    this.incomeChangesSub = this.incomeService.incomeChanges$.subscribe(() => {
      this.loadSavedIncomes();
    });
  }

  async ngOnInit() {
    if (this.currentUserId) {
      await this.loadSavedIncomes();
    }
  }

  ngOnDestroy() {
    if (this.incomeChangesSub) {
      this.incomeChangesSub.unsubscribe();
    }
  }

  async loadSavedIncomes() {
    if (!this.currentUserId) return;
    try {
      this.savedIncomes = await this.incomeService.getIncomes(this.currentUserId);
      console.log('Saved incomes:', this.savedIncomes);
    } catch (error) {
      console.error('Error loading incomes:', error);
    }
  }

  async onSubmit() {
    if (!this.currentUserId) {
      console.error('No user logged in');
      this.router.navigate(['/login']);
      return;
    }

    if (this.incomeForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      try {
        const newIncome = {
          name: this.incomeForm.value.name,
          type: this.incomeForm.value.type,
          amount: Number(this.incomeForm.value.amount),
          userId: this.currentUserId
        };

        await this.incomeService.addIncome(this.currentUserId, newIncome);
        this.incomeForm.reset();
      } catch (error) {
        console.error('Error saving income:', error);
      } finally {
        this.isSubmitting = false;
      }
    }
  }

  async removeIncome(income: Income) {
    if (!this.currentUserId) return;
    try {
      await this.incomeService.removeIncome(income.id);
      this.savedIncomes = this.savedIncomes.filter(i => i.id !== income.id);
    } catch (error) {
      console.error('Error removing income:', error);
    }
  }

  viewIncomeDetails(income: Income) {
    this.router.navigate(['/income', income.id]);
  }

  navigateBack() {
    this.router.navigate(['/welcome']);
  }

  continueToNext() {
    if (this.savedIncomes.length > 0) {
      this.router.navigate(['/finance-method']);
    }
  }
} 