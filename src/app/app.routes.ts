import { Routes } from '@angular/router';
import { WelcomeComponent } from './pages/welcome/welcome.component';
import { IncomeFormComponent } from './pages/income-form/income-form.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { FinanceMethodComponent } from './pages/finance-method/finance-method.component';
import { ExpensesFormComponent } from './pages/expenses-form/expenses-form.component';
import { IncomeDetailComponent } from './pages/income-detail/income-detail.component';
import { IncomeEditComponent } from './pages/income-edit/income-edit.component';
import { ExpenseDetailComponent } from './pages/expense-detail/expense-detail.component';
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
    path: 'finance-method', 
    component: FinanceMethodComponent,
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
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];
