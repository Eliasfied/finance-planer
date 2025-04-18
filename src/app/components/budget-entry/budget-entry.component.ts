import { Component, OnInit, inject, signal, computed, effect, Input, ContentChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IonCard, IonCardContent, IonFab, IonFabButton, IonIcon } from '@ionic/angular/standalone';
import { ModalController } from '@ionic/angular/standalone';
import { ProgressDotsComponent } from '../../components/progress-dots/progress-dots.component';
import { NavHeaderComponent } from '../../components/nav-header/nav-header.component';
import { BudgetEntryService } from '../../services/budget-entry.service';
import { DistributionMethodService } from '../../services/distribution-method.service';
import { IncomeService } from '../../services/income.service';
import { BaseBudgetEntry, EntryCategory } from '../../interfaces/budget-entry.interface';
import { addOutline } from 'ionicons/icons';

@Component({
  selector: 'app-budget-entry',
  templateUrl: './budget-entry.component.html',
  styleUrls: ['./budget-entry.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonCard,
    IonCardContent,
    IonFab,
    IonFabButton,
    IonIcon,
    ProgressDotsComponent,
    NavHeaderComponent
  ]
})
export class BudgetEntryComponent<T extends BaseBudgetEntry> implements OnInit {
  private router = inject(Router);
  private modalCtrl = inject(ModalController);
  private incomeService = inject(IncomeService);
  private distributionService = inject(DistributionMethodService);
  
  // Icon definitions
  addOutline = addOutline;
  
  // Input parameters for page properties
  @Input() pageTitle: string = 'Budget Items';
  @Input() entryService!: BudgetEntryService<T>;
  @Input() entryType: 'expenses' | 'investments' | 'savings' = 'expenses';
  @Input() addModalComponent: any;
  @Input() editModalComponent: any;
  @Input() categoryIcons: Record<string, string> = {};
  
  // Template references for custom rendering
  @ContentChild('categoryTemplate') categoryTemplate?: TemplateRef<any>;
  @ContentChild('entryTemplate') entryTemplate?: TemplateRef<any>;
  
  // State
  private categories = signal<EntryCategory<T>[]>([]);
  
  // Exposure for template
  entryCategories = this.categories.asReadonly();
  
  // Computed values
  totalAmount = computed(() => 
    this.entryService.totalMonthlyAmount()
  );
  
  budget = computed(() => {
    const totalIncome = this.incomeService.totalMonthlyIncome();
    
    switch(this.entryType) {
      case 'expenses':
        return totalIncome * (this.distributionService.expensesPercentage() / 100);
      case 'investments':
        return totalIncome * (this.distributionService.investmentsPercentage() / 100);
      case 'savings':
        return totalIncome * (this.distributionService.savingsPercentage() / 100);
      default:
        return 0;
    }
  });
  
  leftToAllocate = computed(() => 
    this.budget() - this.totalAmount()
  );
  
  progressPercentage = computed(() => 
    this.budget() > 0 ? (this.totalAmount() / this.budget()) * 100 : 0
  );

  constructor() {
    // Effect for updates when data changes
    effect(() => {
      const entries = this.entryService?.items();
      if (entries) {
        this.updateCategories(entries);
      }
    });
  }

  async ngOnInit() {
    if (this.entryService) {
      await this.entryService.forceRefresh();
    }
  }

  // Update categories from entries
  private updateCategories(entries: T[] = []) {
    if (!entries || entries.length === 0) {
      entries = this.entryService?.items() || [];
    }
    
    this.categories.set(this.groupEntriesByCategory(entries));
  }

  // Group entries by category
  private groupEntriesByCategory(entries: T[]): EntryCategory<T>[] {
    if (!entries || entries.length === 0) {
      return [];
    }
    
    const categoriesMap = new Map<string, EntryCategory<T>>();
    
    entries.forEach(entry => {
      if (!categoriesMap.has(entry.category)) {
        categoriesMap.set(entry.category, {
          name: entry.category,
          icon: this.getCategoryIcon(entry.category),
          totalAmount: 0,
          entries: []
        });
      }
      
      const category = categoriesMap.get(entry.category)!;
      category.entries.push(entry);
      category.totalAmount += this.entryService.getMonthlyAmount(entry);
    });

    // Sort entries within each category
    categoriesMap.forEach(category => {
      category.entries.sort((a, b) => this.entryService.getMonthlyAmount(b) - this.entryService.getMonthlyAmount(a));
    });

    // Convert map to array and sort categories by total amount
    return Array.from(categoriesMap.values()).sort((a, b) => b.totalAmount - a.totalAmount);
  }

  // Get icon for category
  private getCategoryIcon(category: string): string {
    return this.categoryIcons[category] || 'apps';
  }

  // Actions
  async addNewEntry() {
    if (!this.addModalComponent) {
      console.error('Add modal component not provided');
      return;
    }
    
    const modal = await this.modalCtrl.create({
      component: this.addModalComponent
    });
    
    await modal.present();
    await modal.onWillDismiss();
    // The effect automatically updates the UI
  }

  async onEntryClick(entry: T) {
    if (!this.editModalComponent) {
      console.error('Edit modal component not provided');
      return;
    }
    
    const modal = await this.modalCtrl.create({
      component: this.editModalComponent,
      componentProps: {
        entry: entry
      }
    });
    
    await modal.present();
    await modal.onWillDismiss();
    // The effect automatically updates the UI
  }
} 