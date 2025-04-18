import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
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
import { NavHeaderComponent } from 'src/app/components/nav-header/nav-header.component';

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
    ProgressDotsComponent,
    NavHeaderComponent
  ]
})
export class IncomeFormComponent {
  private router = inject(Router);
  public incomeService = inject(IncomeService);
  private modalCtrl = inject(ModalController);

  constructor() {}

  async openAddIncomeModal() {
    const { AddIncomeModalComponent } = await import('./add-income-modal/add-income-modal.component');
    
    const modal = await this.modalCtrl.create({
      component: AddIncomeModalComponent,
      cssClass: 'income-modal'
    });

    modal.onDidDismiss().then(async (result) => {
      if (result.data) {
        const newIncomeData: Omit<Income, 'id' | 'userId'> = {
          name: result.data.name,
          type: result.data.type,
          amount: Number(result.data.amount)
        };

        try {
          await this.incomeService.addIncome(newIncomeData);
        } catch (error) {
          console.error('Error adding income via modal:', error);
        }
      }
    });

    return await modal.present();
  }

  viewIncomeDetails(income: Income) {
    this.router.navigate(['/income', income.id]);
  }

  navigateBack() {
    this.router.navigate(['/welcome']);
  }

  continueToNext() {
    if (this.incomeService.savedIncomes().length > 0) {
      this.router.navigate(['/distribution-method']);
    } else {
      console.log('Please add at least one income source to continue.');
    }
  }
} 