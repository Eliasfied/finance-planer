import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalController } from '@ionic/angular/standalone';
import { BudgetEntryService } from '../../../services/budget-entry.service';
import { BaseBudgetEntry } from '../../../interfaces/budget-entry.interface';
import { arrowBack } from 'ionicons/icons';
import { addIcons } from 'ionicons';

// Register the icons
addIcons({ 
  arrowBack
});

@Component({
  template: '',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ]
})
export abstract class BaseAddEntryModalComponent<T extends BaseBudgetEntry> {
  protected modalCtrl = inject(ModalController);
  
  // This property must be implemented by child classes
  abstract entryService: BudgetEntryService<T>;
  abstract entry: Omit<T, 'id' | 'userId' | 'createdAt'>;
  abstract categories: string[];
  
  // Method for adding an entry
  async addEntry() {
    try {
      await this.entryService.addItem(this.entry);
      this.modalCtrl.dismiss(true);
    } catch (error) {
      console.error('Error adding entry:', error);
    }
  }

  // Method for closing the modal
  dismiss() {
    this.modalCtrl.dismiss();
  }
} 