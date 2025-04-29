import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { authGuard, adminGuard, professionalGuard } from './shared/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        loadComponent: () => import('./auth/components/login/login.component').then(c => c.LoginComponent)
      },
      {
        path: 'register',
        loadComponent: () => import('./auth/components/register/register.component').then(c => c.RegisterComponent)
      },
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: 'admin',
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./admin/components/dashboard/dashboard.component').then(c => c.AdminDashboardComponent),
        canActivate: [() => adminGuard()]
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: 'professional',
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./professional/components/dashboard/dashboard.component').then(c => c.ProfessionalDashboardComponent),
        canActivate: [() => professionalGuard()],
        data: { preload: true } // Préchargement pour améliorer la performance
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: 'profile',
    loadComponent: () => import('./shared/profile/profile.component').then(c => c.ProfileComponent),
    canActivate: [() => authGuard()], // Protection par authentification
    data: { preload: true } // Préchargement pour améliorer la performance
  },
  {
    path: '',
    component: HomeComponent,
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];
