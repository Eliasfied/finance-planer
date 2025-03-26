import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';

interface FinanceMethod {
  name: string;
  expenses: number;
  investments: number;
  savings: number;
}

@Component({
  selector: 'app-finance-method',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IonicModule],
  templateUrl: './finance-method.component.html',
  styleUrls: ['./finance-method.component.scss']
})
export class FinanceMethodComponent implements OnInit {
  financeMethodForm: FormGroup;
  isCustomizing = false;
  defaultMethod: FinanceMethod = {
    name: '75/15/10',
    expenses: 75,
    investments: 15,
    savings: 10
  };

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.financeMethodForm = this.fb.group({
      expenses: [75, [Validators.required, Validators.min(0), Validators.max(100)]],
      investments: [15, [Validators.required, Validators.min(0), Validators.max(100)]],
      savings: [10, [Validators.required, Validators.min(0), Validators.max(100)]]
    }, { validators: this.totalMustBe100 });
  }

  ngOnInit() {
    // Subscribe to form changes to ensure total is 100%
    this.financeMethodForm.valueChanges.subscribe(() => {
      if (this.financeMethodForm.valid) {
        const total = this.getTotal();
        if (total !== 100) {
          this.adjustValues(total);
        }
      }
    });
  }

  // Custom validator to ensure total is 100%
  totalMustBe100(group: FormGroup) {
    const expenses = group.get('expenses')?.value || 0;
    const investments = group.get('investments')?.value || 0;
    const savings = group.get('savings')?.value || 0;
    
    return expenses + investments + savings === 100 ? null : { totalNot100: true };
  }

  getTotal(): number {
    const { expenses, investments, savings } = this.financeMethodForm.value;
    return expenses + investments + savings;
  }

  adjustValues(total: number) {
    const formValue = this.financeMethodForm.value;
    const factor = 100 / total;
    
    this.financeMethodForm.patchValue({
      expenses: Math.round(formValue.expenses * factor),
      investments: Math.round(formValue.investments * factor),
      savings: Math.round(formValue.savings * factor)
    }, { emitEvent: false });
  }

  toggleCustomization() {
    this.isCustomizing = !this.isCustomizing;
    if (!this.isCustomizing) {
      this.financeMethodForm.patchValue(this.defaultMethod);
    }
  }

  onSubmit() {
    if (this.financeMethodForm.valid) {
      const method: FinanceMethod = {
        name: this.isCustomizing ? 'Custom' : this.defaultMethod.name,
        ...this.financeMethodForm.value
      };
      console.log('Selected method:', method);
      // TODO: Save the method to user settings
      this.router.navigate(['/dashboard']);
    }
  }
} 