import { Routes } from '@angular/router';
import { WelcomeComponent } from './pages/onboarding/explanations/welcome/welcome.component';
import { IncomeFormComponent } from './pages/onboarding/income/income-form.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ExpensesFormComponent } from './pages/onboarding/expenses/expenses-form.component';
import { IncomeDetailComponent } from './pages/onboarding/income/income-detail/income-detail.component';
import { IncomeEditComponent } from './pages/onboarding/income/edit-income/income-edit.component';
import { ExpenseDetailComponent } from './pages/onboarding/expenses/expense-detail/expense-detail.component';
import { authGuard } from './guards/auth.guard';
import { DistributionMethodComponent } from './pages/onboarding/distribution-method/distribution-method.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { 
    path: 'welcome', 
    component: WelcomeComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'income-form', 
    component: IncomeFormComponent,
    canActivate: [authGuard]
  },
  {
    path: 'income/:id',
    component: IncomeDetailComponent,
    canActivate: [authGuard]
  },
  {
    path: 'income/:id/edit',
    component: IncomeEditComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'expenses-form', 
    component: ExpensesFormComponent,
    canActivate: [authGuard]
  },
  {
    path: 'expense/:id',
    component: ExpenseDetailComponent,
    canActivate: [authGuard]
  },
  {
    path: 'distribution-method',
    component: DistributionMethodComponent,
    canActivate: [authGuard]

  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];
