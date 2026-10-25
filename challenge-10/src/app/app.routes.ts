import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'tareas', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'tareas',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/tareas/tareas.component').then((m) => m.TareasComponent),
  },
  {
    path: 'perfil',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/perfil/perfil.component').then((m) => m.PerfilComponent),
  },
  { path: '**', redirectTo: 'tareas' },
];
