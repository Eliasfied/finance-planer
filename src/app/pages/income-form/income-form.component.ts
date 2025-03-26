import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { trashOutline, addOutline } from 'ionicons/icons';
import { Router } from '@angular/router';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import { FinancialDataService } from '../../services/financial-data.service';
import { FinancialEntry } from '../../models/financial-data.interface';

// Register the icons
addIcons({ trashOutline, addOutline });

@Component({
  selector: 'app-income-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IonicModule],
  templateUrl: './income-form.component.html',
  styleUrls: ['./income-form.component.scss']
})
export class IncomeFormComponent {
  incomeForm: FormGroup;
  currentUserId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private auth: Auth,
    private financialDataService: FinancialDataService
  ) {
    this.incomeForm = this.fb.group({
      incomes: this.fb.array([])
    });
    this.addIncome(); // Add one empty income entry by default

    // Get current user
    onAuthStateChanged(this.auth, (user) => {
      this.currentUserId = user?.uid || null;
    });
  }

  get incomes() {
    return this.incomeForm.get('incomes') as FormArray;
  }

  addIncome() {
    const incomeGroup = this.fb.group({
      source: ['', Validators.required],
      amount: [null, [Validators.required, Validators.min(0)]]
    });
    this.incomes.push(incomeGroup);
  }

  removeIncome(index: number) {
    if (this.incomes.length > 1) {
      this.incomes.removeAt(index);
    }
  }

  async onSubmit() {
    if (this.incomeForm.valid && this.currentUserId) {
      try {
        // Convert form data to FinancialEntry[]
        const incomeEntries: FinancialEntry[] = this.incomes.controls.map(control => ({
          name: control.get('source')?.value,
          amount: Number(control.get('amount')?.value)
        }));
        console.log('Saving income entries:', incomeEntries);

        // Save each income entry
        for (const entry of incomeEntries) {
          await this.financialDataService.addIncome(this.currentUserId, entry);
          console.log('Saved income entry:', entry);
        }

        // Navigate to finance method page
        this.router.navigate(['/finance-method']);
      } catch (error) {
        console.error('Error saving incomes:', error);
      }
    }
  }
} 