import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProgressDotsComponent } from 'src/app/components/progress-dots/progress-dots.component';
import { trigger, transition, style, animate } from '@angular/animations';
import { DistributionMethodService } from 'src/app/services/distribution-method.service';
import { NavHeaderComponent } from 'src/app/components/nav-header/nav-header.component';



@Component({
  selector: 'app-distribution-method',
  templateUrl: './distribution-method.component.html',
  styleUrls: ['./distribution-method.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, ReactiveFormsModule, ProgressDotsComponent, NavHeaderComponent],
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
  isSaving = false;
  
  // Services via inject
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);
  public distributionService = inject(DistributionMethodService);

  // Standard recommended values
  private recommendedValues = {
    expenses: 75,
    investments: 15,
    savings: 10
  };
  
  // Flag to track if user selected recommended method
  public recommendedSelected = false;

  constructor() {
    // Initialize the form with values from service or default
    this.distributionMethodForm = this.formBuilder.group({
      expenses: [this.distributionService.expensesPercentage()],
      investments: [this.distributionService.investmentsPercentage()],
      savings: [this.distributionService.savingsPercentage()]
    });
  }

  ngOnInit() {
    // Listen to form changes to update the title
    this.distributionMethodForm.valueChanges.subscribe(() => {
      this.getMethodTitle();
    });

    // Check if there's a custom method saved and automatically expand Custom section
    this.checkForCustomMethod();
    
    // If the method is already the recommended one, mark it as selected
    if (this.isRecommendedMethod()) {
      this.recommendedSelected = true;
    }
  }

  // Check if user has a saved custom method that's different from recommended
  private checkForCustomMethod() {
    const currentMethod = this.distributionService.distributionMethod();
    
    if (currentMethod) {
      const isCustom = 
        currentMethod.expenses !== this.recommendedValues.expenses ||
        currentMethod.investments !== this.recommendedValues.investments ||
        currentMethod.savings !== this.recommendedValues.savings;
      
      if (isCustom) {
        // User has a custom method saved, open the custom section
        this.isCustomizing = true;
        
        // Make sure form values reflect the current distribution method
        this.distributionMethodForm.patchValue({
          expenses: this.distributionService.expensesPercentage(),
          investments: this.distributionService.investmentsPercentage(),
          savings: this.distributionService.savingsPercentage()
        });
      }
    }
  }

  // Select recommended method (but don't save until Next is clicked)
  selectRecommendedMethod() {
    this.isCustomizing = false;
    this.recommendedSelected = true;
    
    // Update form with the recommended values
    this.distributionMethodForm.patchValue({
      expenses: this.recommendedValues.expenses,
      investments: this.recommendedValues.investments,
      savings: this.recommendedValues.savings
    });
  }

  toggleCustomization() {
    if (this.isCustomizing && this.getTotal() !== 100) {
      return; // Don't allow closing if total is not 100%
    }
    
    if (!this.isCustomizing) {
      this.distributionMethodForm.patchValue({
        expenses: this.distributionService.expensesPercentage(),
        investments: this.distributionService.investmentsPercentage(),
        savings: this.distributionService.savingsPercentage()
      });
      
      // Reset recommended selection flag when custom is opened
      this.recommendedSelected = false;
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

  // Check if current distribution is the recommended one
  isRecommendedMethod(): boolean {
    const current = this.distributionService.distributionMethod();
    if (!current) return true; // Default to recommended if no method saved
    
    return (
      current.expenses === this.recommendedValues.expenses &&
      current.investments === this.recommendedValues.investments &&
      current.savings === this.recommendedValues.savings
    );
  }

  navigateBack() {
    this.router.navigate(['/income-form']);
  }

  async onSubmit() {
    const methodToSave = this.recommendedSelected ? 
      this.recommendedValues : 
      {
        expenses: this.distributionMethodForm.value.expenses,
        investments: this.distributionMethodForm.value.investments,
        savings: this.distributionMethodForm.value.savings
      };

    if (!this.recommendedSelected && (this.getTotal() !== 100 || !this.distributionMethodForm.valid)) {
      console.error('Total must be 100% for custom distribution');
      return;
    }

    try {
      this.isSaving = true;
      // Save the selected method
      await this.distributionService.saveDistributionMethod(methodToSave);
      // Navigate to next page
      this.router.navigate(['/expenses-budget']);
    } catch (error) {
      console.error('Error saving distribution method:', error);
    } finally {
      this.isSaving = false;
    }
  }
} 