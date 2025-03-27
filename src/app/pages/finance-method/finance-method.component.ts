import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProgressDotsComponent } from '../../components/progress-dots/progress-dots.component';
import { trigger, transition, style, animate } from '@angular/animations';
import { addIcons } from 'ionicons';
import { cartOutline, trendingUpOutline, walletOutline, arrowForwardOutline, checkmarkCircle, createOutline, warningOutline, closeOutline } from 'ionicons/icons';
import { FinancialDataService } from 'src/app/services/financial-data.service';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';

// Register the icons
addIcons({ 
  cartOutline, 
  trendingUpOutline, 
  walletOutline, 
  arrowForwardOutline, 
  checkmarkCircle,
  createOutline,
  warningOutline,
  closeOutline
});

interface FinanceMethod {
  name: string;
  expenses: number;
  investments: number;
  savings: number;
}

@Component({
  selector: 'app-finance-method',
  templateUrl: './finance-method.component.html',
  styleUrls: ['./finance-method.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, ReactiveFormsModule, ProgressDotsComponent],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateY(-10px)', opacity: 0 }),
        animate('200ms ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ transform: 'translateY(-10px)', opacity: 0 }))
      ])
    ])
  ]
})
export class FinanceMethodComponent implements OnInit {
  financeMethodForm: FormGroup;
  isCustomizing = false;
  defaultValues = {
    expenses: 75,
    investments: 15,
    savings: 10
  };
  currentUserId: string | null = null;


  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private financialDataService: FinancialDataService,
    private auth: Auth,


  ) {
    this.financeMethodForm = this.formBuilder.group({
      expenses: [this.defaultValues.expenses],
      investments: [this.defaultValues.investments],
      savings: [this.defaultValues.savings]
    });

    // Get current user
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.currentUserId = user.uid;
      } else {
        console.error('No user logged in');
        this.router.navigate(['/login']);
      }
    });
  }



  ngOnInit() {
    // Listen to form changes to update the title
    this.financeMethodForm.valueChanges.subscribe(() => {
      // Force change detection for the title
      this.getMethodTitle();
    });
  }

  isDefaultMethod(): boolean {
    const currentValues = this.financeMethodForm.value;
    return currentValues.expenses === this.defaultValues.expenses &&
           currentValues.investments === this.defaultValues.investments &&
           currentValues.savings === this.defaultValues.savings;
  }

  getMethodTitle(): string {
    const values = this.financeMethodForm.value;
    return `${values.expenses}/${values.investments}/${values.savings} - Distribution`;
  }

  toggleCustomization() {
    if (this.isCustomizing && this.getTotal() !== 100) {
      return; // Don't allow closing if total is not 100%
    }
    this.isCustomizing = !this.isCustomizing;
  }

  getTotal(): number {
    const values = this.financeMethodForm.value;
    return values.expenses + values.investments + values.savings;
  }

  navigateBack() {
    this.router.navigate(['/income-form']);
  }

  onSubmit() {
    if (this.financeMethodForm.valid && this.getTotal() === 100) {
      this.financialDataService.addDistributionValues(this.currentUserId as string, this.financeMethodForm.value.expenses, this.financeMethodForm.value.investments, this.financeMethodForm.value.savings);
      
      this.router.navigate(['/expenses-form']);
    }
  }
} 