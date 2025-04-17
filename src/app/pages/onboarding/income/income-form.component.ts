import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import { Income } from 'src/app/interfaces/income.interface';
import { ProgressDotsComponent } from 'src/app/components/progress-dots/progress-dots.component';
import { IncomeService } from 'src/app/services/income.service';
import { addIcons } from 'ionicons';
import { 
  businessOutline,
  add,
  arrowBackOutline,
  walletOutline,
  trendingDownOutline,
  trendingUpOutline,
  helpCircleOutline,
  chevronBackOutline,
  chevronForwardOutline
} from 'ionicons/icons';
import { Subscription } from 'rxjs';

// Register Ionicons
addIcons({
  businessOutline,
  add,
  arrowBackOutline,
  walletOutline,
  trendingDownOutline,
  trendingUpOutline,
  helpCircleOutline,
  chevronBackOutline,
  chevronForwardOutline
});

@Component({
  selector: 'app-income-form',
  templateUrl: './income-form.component.html',
  styleUrls: ['./income-form.component.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    IonicModule, 
    ProgressDotsComponent
  ]
})
export class IncomeFormComponent implements OnInit, OnDestroy {
  savedIncomes: Income[] = [];
  totalMonthlyIncome: number = 0;
  currentUserId: string | null = null;
  private incomeChangesSub?: Subscription;

  constructor(
    private router: Router,
    private auth: Auth,
    private incomeService: IncomeService,
    private modalCtrl: ModalController
  ) {
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

  async openAddIncomeModal() {
    const { AddIncomeModalComponent } = await import('./add-income-modal/add-income-modal.component');
    
    const modal = await this.modalCtrl.create({
      component: AddIncomeModalComponent,
      cssClass: 'income-modal'
    });

    modal.onDidDismiss().then(async (result) => {
      if (result.data && this.currentUserId) {
        const newIncome: Omit<Income, 'id'> = {
          name: result.data.name,
          type: result.data.type,
          amount: Number(result.data.amount),
          userId: this.currentUserId
        };
        
        await this.incomeService.addIncome(this.currentUserId, newIncome);
        this.savedIncomes.push(newIncome as Income);
      }
    });

    return await modal.present();
  }

  getTotalIncome(): number {
    return this.savedIncomes.reduce((total, income) => total + income.amount, 0);
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
      this.calculateTotalIncome();
    } catch (error) {
      console.error('Error loading incomes:', error);
    }
  }

  calculateTotalIncome() {
    this.totalMonthlyIncome = this.getTotalIncome();
  }

  viewIncomeDetails(income: Income) {
    this.router.navigate(['/income', income.id]);
  }

  navigateBack() {
    this.router.navigate(['/welcome']);
  }

  continueToNext() {
    if (this.savedIncomes.length > 0) {
      this.router.navigate(['/distribution-method']);
    }
  }
} 