import { Component, inject, Input, OnInit } from '@angular/core';
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
export abstract class BaseEditEntryModalComponent<T extends BaseBudgetEntry> implements OnInit {
  protected modalCtrl = inject(ModalController);
  
  // This property must be implemented by child classes
  abstract entryService: BudgetEntryService<T>;
  abstract categories: string[];
  
  // Input property for the entry to be edited
  @Input() entry!: T;
  
  ngOnInit() {
    if (!this.entry) {
      console.error('No entry provided to edit modal');
      this.dismiss();
    }
  }
  
  // Method for updating an entry
  async updateEntry() {
    try {
      await this.entryService.updateItem(this.entry);
      this.modalCtrl.dismiss(true);
    } catch (error) {
      console.error('Error updating entry:', error);
    }
  }
  
  // Method for deleting an entry
  async deleteEntry() {
    try {
      await this.entryService.deleteItem(this.entry.id);
      this.modalCtrl.dismiss(true);
    } catch (error) {
      console.error('Error deleting entry:', error);
    }
  }

  // Method for closing the modal
  dismiss() {
    this.modalCtrl.dismiss();
  }
} 