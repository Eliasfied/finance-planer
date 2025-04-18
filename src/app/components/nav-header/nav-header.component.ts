import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IonButton, IonIcon } from '@ionic/angular/standalone';
import { chevronBackOutline, chevronForwardOutline } from 'ionicons/icons';

@Component({
  selector: 'app-nav-header',
  templateUrl: './nav-header.component.html',
  styleUrls: ['./nav-header.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonButton,
    IonIcon
  ]
})
export class NavHeaderComponent {
  private router = inject(Router);
  
  // Icon definitions
  chevronBackOutline = chevronBackOutline;
  chevronForwardOutline = chevronForwardOutline;
  
  // Input parameters
  @Input() title: string = '';
  @Input() previousRoute: string = '';
  @Input() nextRoute: string = '';
  @Input() showPrevious: boolean = true;
  @Input() showNext: boolean = true;
  
  // Events (keeping these for compatibility)
  @Output() onPrevious = new EventEmitter<void>();
  @Output() onNext = new EventEmitter<void>();
  
  // Navigation methods
  goToPrevious(): void {
    this.onPrevious.emit();
    
    // Navigate if a route is provided
    if (this.previousRoute) {
      this.router.navigate([this.previousRoute]);
    }
  }
  
  goToNext(): void {
    this.onNext.emit();
    
    // Navigate if a route is provided
    if (this.nextRoute) {
      this.router.navigate([this.nextRoute]);
    }
  }
} 