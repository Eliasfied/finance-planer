import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Income } from 'src/app/interfaces/income.interface';
import { IncomeService } from 'src/app/services/income.service';
import { addIcons } from 'ionicons';
import { arrowBack } from 'ionicons/icons';

// Register Ionicons
addIcons({ arrowBack });

@Component({
  selector: 'app-income-edit',
  templateUrl: './income-edit.component.html',
  styleUrls: ['./income-edit.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, ReactiveFormsModule]
})
export class IncomeEditComponent implements OnInit {
  incomeForm: FormGroup;
  income: Income | null = null;
  isLoading = true;
  isSaving = false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private incomeService: IncomeService
  ) {
    this.incomeForm = this.formBuilder.group({
      name: ['', Validators.required],
      type: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(0)]]
    });
  }

  async ngOnInit() {
    const incomeId = this.route.snapshot.paramMap.get('id');
    if (!incomeId) {
      this.router.navigate(['/income-form']);
      return;
    }

    try {
      this.income = await this.incomeService.getIncome(incomeId);
      if (this.income) {
        this.incomeForm.patchValue({
          name: this.income.name,
          type: this.income.type,
          amount: this.income.amount
        });
      }
      this.isLoading = false;
    } catch (error) {
      console.error('Error loading income:', error);
      this.isLoading = false;
    }
  }

  async onSubmit() {
    if (!this.income || !this.incomeForm.valid || this.isSaving) return;

    this.isSaving = true;
    try {
      const updatedIncome: Income = {
        ...this.income,
        name: this.incomeForm.value.name,
        type: this.incomeForm.value.type,
        amount: Number(this.incomeForm.value.amount)
      };

      await this.incomeService.updateIncome(updatedIncome);
      this.router.navigate(['/income', this.income.id]);
    } catch (error) {
      console.error('Error updating income:', error);
    } finally {
      this.isSaving = false;
    }
  }

  navigateBack() {
    if (this.income) {
      this.router.navigate(['/income', this.income.id]);
    }
  }
} 