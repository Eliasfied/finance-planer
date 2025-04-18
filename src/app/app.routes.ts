import { Routes } from '@angular/router';
import { WelcomeComponent } from './pages/onboarding/explanations/welcome/welcome.component';
import { IncomeFormComponent } from './pages/onboarding/income/income-form.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { authGuard } from './guards/auth.guard';
import { DistributionMethodComponent } from './pages/onboarding/distribution-method/distribution-method.component';
import { ExpensesBudgetComponent } from './pages/onboarding/expenses/expenses-budget.component';
import { InvestmentsBudgetComponent } from './pages/onboarding/investments/investments-budget.component';
import { SavingsBudgetComponent } from './pages/onboarding/savings/savings-budget.component';
import { HomepageComponent } from './pages/homepage/homepage.component';

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
    path: 'expenses-budget', 
    component: ExpensesBudgetComponent,
    canActivate: [authGuard]
  },
  {
    path: 'distribution-method',
    component: DistributionMethodComponent,
    canActivate: [authGuard]
  },
  {
    path: 'investments-budget',
    component: InvestmentsBudgetComponent,
    canActivate: [authGuard]
  },
  {
    path: 'savings-budget',
    component: SavingsBudgetComponent,
    canActivate: [authGuard]
  },
  {
    path: 'homepage',
    component: HomepageComponent,
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];
