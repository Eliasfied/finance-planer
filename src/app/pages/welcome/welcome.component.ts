import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProgressDotsComponent } from '../../components/progress-dots/progress-dots.component';
import { addIcons } from 'ionicons';
import { chevronForwardOutline } from 'ionicons/icons';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ProgressDotsComponent]
})
export class WelcomeComponent {
  constructor(private router: Router) {
    addIcons({
      chevronForwardOutline
    });
  }

  navigateToIncomeForm() {
    this.router.navigate(['/income-form']);
  }
} 