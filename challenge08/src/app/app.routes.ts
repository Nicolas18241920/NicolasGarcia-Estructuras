import { Routes } from '@angular/router';
import { LoginComponent } from './login/login';
import { Ejercicio1Component } from './ejercicio1/ejercicio1';
import { Ejercicio2Component } from './ejercicio2/ejercicio2';
import { authGuard } from './auth-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'ejercicio1', component: Ejercicio1Component, canActivate: [authGuard] },
  { path: 'ejercicio2', component: Ejercicio2Component, canActivate: [authGuard] },
  { path: '**', redirectTo: 'login' }
];