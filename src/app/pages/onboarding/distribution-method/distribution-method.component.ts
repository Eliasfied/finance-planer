import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProgressDotsComponent } from 'src/app/components/progress-dots/progress-dots.component';
import { trigger, transition, style, animate } from '@angular/animations';
import { addIcons } from 'ionicons';
import { cartOutline, trendingUpOutline, walletOutline, arrowForwardOutline, checkmarkCircle, createOutline, warningOutline, closeOutline } from 'ionicons/icons';
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
  selector: 'app-distribution-method',
  templateUrl: './distribution-method.component.html',
  styleUrls: ['./distribution-method.component.scss'],
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
export class DistributionMethodComponent implements OnInit {
  distributionMethodForm: FormGroup;
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
    private auth: Auth
  ) {
    this.distributionMethodForm = this.formBuilder.group({
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
    this.distributionMethodForm.valueChanges.subscribe(() => {
      this.getMethodTitle();
    });
  }

  selectRecommendedMethod() {
    this.isCustomizing = false;
    this.distributionMethodForm.patchValue({
      expenses: this.defaultValues.expenses,
      investments: this.defaultValues.investments,
      savings: this.defaultValues.savings
    });
  }

  toggleCustomization() {
    if (this.isCustomizing && this.getTotal() !== 100) {
      return; // Don't allow closing if total is not 100%
    }
    this.isCustomizing = !this.isCustomizing;
  }

  getMethodTitle(): string {
    const values = this.distributionMethodForm.value;
    return `${values.expenses}/${values.investments}/${values.savings}`;
  }

  getTotal(): number {
    const values = this.distributionMethodForm.value;
    return values.expenses + values.investments + values.savings;
  }

  navigateBack() {
    this.router.navigate(['/income-form']);
  }

  onSubmit() {
      this.router.navigate(['/expenses-form']);
  }
} 