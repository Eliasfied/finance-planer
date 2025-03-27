import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProgressDotsComponent } from '../../components/progress-dots/progress-dots.component';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ProgressDotsComponent]
})
export class WelcomeComponent {
  constructor(private router: Router) {}

  navigateToIncomeForm() {
    this.router.navigate(['/income-form']);
  }
} 