import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  console.log('[AUTH-GUARD] Vérification de l\'authentification. URL actuelle:', router.url);
  console.log('[AUTH-GUARD] Token présent?', !!authService.getToken());

  if (authService.isLoggedIn()) {
    console.log('[AUTH-GUARD] Utilisateur authentifié, accès autorisé');
    return true;
  }

  // Rediriger vers la page de connexion avec l'URL de retour
  console.warn('[AUTH-GUARD] Utilisateur non authentifié, redirection vers la page de connexion');
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
  
  console.log('[PROFESSIONAL-GUARD] Vérification de sécurité pour accès au tableau de bord professionnel');
  console.log('[PROFESSIONAL-GUARD] URL demandée:', router.url);
  
  // Vérification du token
  const token = authService.getToken();
  console.log('[PROFESSIONAL-GUARD] Token présent?', !!token);
  
  // Vérification de la session
  const isLoggedIn = authService.isLoggedIn();
  console.log('[PROFESSIONAL-GUARD] Utilisateur connecté?', isLoggedIn);
  
  // Récupération des informations utilisateur
  const currentUser = authService.getCurrentUser();
  console.log('[PROFESSIONAL-GUARD] Utilisateur actuel:', currentUser);
  
  // Vérification des rôles
  const roles = currentUser?.roles || [];
  console.log('[PROFESSIONAL-GUARD] Rôles utilisateur:', roles);
  const hasProfessionalRole = authService.hasRole('ROLE_PROFESSIONAL');
  console.log('[PROFESSIONAL-GUARD] Rôle PROFESSIONAL?', hasProfessionalRole);

  // Accès autorisé si connecté et a le rôle professionnel
  if (isLoggedIn && hasProfessionalRole) {
    console.log('[PROFESSIONAL-GUARD] Accès AUTORISÉ au tableau de bord professionnel');
    return true;
  }

  // Si l'utilisateur est connecté mais n'est pas professionnel, rediriger selon le rôle
  if (isLoggedIn) {
    console.warn('[PROFESSIONAL-GUARD] SÉCURITÉ: Utilisateur connecté mais sans le rôle PROFESSIONAL');
    
    if (authService.hasRole('ROLE_ADMIN')) {
      console.log('[PROFESSIONAL-GUARD] Redirection vers le tableau de bord administrateur');
      return router.parseUrl('/admin/dashboard');
    }
    
    console.warn('[PROFESSIONAL-GUARD] Accès NON AUTORISÉ: Utilisateur sans rôle approprié, redirection vers login');
    // Journalisation de la tentative d'accès non autorisée
    console.error('[PROFESSIONAL-GUARD] Tentative d\'accès non autorisée - Utilisateur ID: ' + 
                 (currentUser?.id || 'inconnu') + ', Roles: ' + (roles.join(',') || 'aucun'));
    return router.parseUrl('/auth/login');
  }

  // Si l'utilisateur n'est pas connecté, rediriger vers la page de connexion
  console.warn('[PROFESSIONAL-GUARD] Accès REFUSÉ: Utilisateur non authentifié, redirection vers login');
  return router.parseUrl('/auth/login?returnUrl=' + router.url);
};
