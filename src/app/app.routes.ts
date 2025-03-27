import { Routes } from '@angular/router';
import { WelcomeComponent } from './pages/welcome/welcome.component';
import { IncomeFormComponent } from './pages/income-form/income-form.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { FinanceMethodComponent } from './pages/finance-method/finance-method.component';
import { ExpensesFormComponent } from './pages/expenses-form/expenses-form.component';
import { authGuard } from './guards/auth.guard';

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
    path: 'finance-method', 
    component: FinanceMethodComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'expenses-form', 
    component: ExpensesFormComponent,
    canActivate: [authGuard]
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];
