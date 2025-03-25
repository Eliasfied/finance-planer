import { Routes } from '@angular/router';
import { WelcomeComponent } from './pages/welcome/welcome.component';
import { IncomeFormComponent } from './pages/income-form/income-form.component';

export const routes: Routes = [
  { path: '', component: WelcomeComponent },
  { path: 'income-form', component: IncomeFormComponent },
  { path: '**', redirectTo: '' }
];
