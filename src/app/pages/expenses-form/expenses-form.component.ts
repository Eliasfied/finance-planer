import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { 
  chevronBackOutline, 
  addOutline,
  carOutline,
  receiptOutline
} from 'ionicons/icons';

// Register Ionicons
addIcons({
  chevronBackOutline,
  addOutline,
  carOutline,
  receiptOutline
});

@Component({
  selector: 'app-expenses-form',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './expenses-form.component.html',
  styleUrls: ['./expenses-form.component.scss']
})
export class ExpensesFormComponent {
  constructor(private router: Router) {}

  goBack() {
    this.router.navigate(['/finance-method']);
  }

  addExpense() {
    // TODO: Implement add expense functionality
    console.log('Add expense clicked');
  }
}
