import { Routes } from '@angular/router';
import { LoginComponent } from './login/login';
import { RegisterComponent } from './register/register';
import { SmartSearchComponent } from './smart-search/smart-search';
import { authGuard } from './auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'search', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'search', component: SmartSearchComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: 'search' }
];
