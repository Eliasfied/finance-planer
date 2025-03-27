import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-progress-dots',
  templateUrl: './progress-dots.component.html',
  styleUrls: ['./progress-dots.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class ProgressDotsComponent {
  @Input() currentStep: number = 0;
  @Input() totalSteps: number = 6;

  get steps(): number[] {
    return Array(this.totalSteps).fill(0).map((_, i) => i);
  }
} 