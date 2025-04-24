import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true;
  }

  // Rediriger vers la page de connexion avec l'URL de retour
  return router.parseUrl('/auth/login?returnUrl=' + router.url);
};

export const adminGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn() && authService.hasRole('ROLE_ADMIN')) {
    return true;
  }

  // Si l'utilisateur est connecté mais n'est pas admin, rediriger vers le dashboard approprié
  if (authService.isLoggedIn()) {
    if (authService.hasRole('ROLE_PROFESSIONAL')) {
      return router.parseUrl('/professional/dashboard');
    }
    return router.parseUrl('/auth/login');
  }

  // Si l'utilisateur n'est pas connecté, rediriger vers la page de connexion
  return router.parseUrl('/auth/login?returnUrl=' + router.url);
};

export const professionalGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn() && authService.hasRole('ROLE_PROFESSIONAL')) {
    return true;
  }

  // Si l'utilisateur est connecté mais n'est pas professionnel, rediriger vers le dashboard approprié
  if (authService.isLoggedIn()) {
    if (authService.hasRole('ROLE_ADMIN')) {
      return router.parseUrl('/admin/dashboard');
    }
    return router.parseUrl('/auth/login');
  }

  // Si l'utilisateur n'est pas connecté, rediriger vers la page de connexion
  return router.parseUrl('/auth/login?returnUrl=' + router.url);
};
