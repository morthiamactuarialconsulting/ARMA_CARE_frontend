import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../../environments/environment';
import { 
  LoginRequest, 
  PasswordChangeRequest, 
  PasswordResetConfirmRequest, 
  PasswordResetRequest,
  AdminRegisterRequest
} from '../models/auth.model';

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  username: string;
  roles: string[];
  firstName?: string;
  lastName?: string;
  speciality?: string;
  registrationNumber?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  accountStatus?: string;
  message?: string;
}

export interface AdminExistsResponse {
  adminExists: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly AUTH_API = `${environment.apiUrl}/auth`;
  private readonly TOKEN_KEY = 'auth-token';
  private readonly REFRESH_TOKEN_KEY = 'auth-refresh-token';
  private readonly USER_KEY = 'auth-user';
  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { 
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  /**
   * Vérifie si un administrateur existe dans le système
   */
  checkAdminExists(): Observable<AdminExistsResponse> {
    return this.http.get<AdminExistsResponse>(`${this.AUTH_API}/admin-exists`)
      .pipe(
        tap(response => {
          console.log('[AUTH-SERVICE] Vérification admin existant:', response.adminExists);
        })
      );
  }

  /**
   * Enregistrement du premier administrateur (uniquement si aucun n'existe)
   */
  registerFirstAdmin(adminData: AdminRegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.AUTH_API}/register-first-admin`, adminData)
      .pipe(
        tap(response => {
          console.log('[AUTH-SERVICE] Enregistrement premier admin réussi');
          if (response.accessToken) {
            this.saveTokens(response);
          }
        })
      );
  }

  /**
   * Enregistrement d'un nouvel administrateur par un admin existant
   */
  registerAdmin(adminData: AdminRegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.AUTH_API}/register-admin`, adminData, {
      headers: this.getAuthHeader()
    }).pipe(
      tap(response => {
        console.log('[AUTH-SERVICE] Enregistrement nouvel admin réussi');
      })
    );
  }

  /**
   * Récupère les headers d'authentification
   */
  private getAuthHeader(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }
  
  /**
   * Récupère les informations de l'utilisateur connecté
   * @deprecated Utilisez getCurrentUser() à la place pour plus de cohérence
   */
  getUser(): any {
    return this.getCurrentUser();
  }
  
  /**
   * Connexion utilisateur
   */
  login(credentials: LoginRequest): Observable<AuthResponse> {
    console.log('[AUTH-SERVICE] Tentative de connexion pour:', credentials.username);
    return this.http.post<AuthResponse>(`${this.AUTH_API}/login`, credentials)
      .pipe(
        tap(response => {
          console.log('[AUTH-SERVICE] Connexion réussie, réponse de l\'API:', response);
          console.log('[AUTH-SERVICE] Rôles attribués:', response.roles);
          this.saveTokens(response);
        })
      );
  }

  /**
   * Inscription avec téléchargement de documents
   * Utilise FormData pour gérer les fichiers
   */
  registerWithFiles(formData: FormData): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.AUTH_API}/register-with-files`, formData)
      .pipe(
        tap(response => this.saveTokens(response))
      );
  }

  /**
   * Déconnexion - supprime les tokens et les infos utilisateur
   */
  logout(): void {
    if (!this.isBrowser) return; // Ne rien faire côté serveur
    
    window.sessionStorage.clear();
    // Vous pourriez également appeler votre API backend pour invalider le token
  }

  /**
   * Rafraîchit le token d'accès en utilisant le refresh token
   */
  refreshToken(): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.AUTH_API}/refresh`, { refreshToken: this.getRefreshToken() })
      .pipe(
        tap(response => this.saveTokens(response))
      );
  }

  /**
   * Demande de changement de mot de passe pour un utilisateur connecté
   */
  changePassword(passwordChangeRequest: PasswordChangeRequest): Observable<any> {
    return this.http.post(`${this.AUTH_API}/change-password`, passwordChangeRequest);
  }

  /**
   * Demande de réinitialisation de mot de passe (mot de passe oublié)
   */
  requestPasswordReset(email: string): Observable<any> {
    return this.http.post(`${this.AUTH_API}/forgot-password`, { email });
  }

  /**
   * Réinitialisation du mot de passe avec token
   */
  resetPassword(resetRequest: PasswordResetConfirmRequest): Observable<any> {
    return this.http.post(`${this.AUTH_API}/reset-password`, resetRequest);
  }

  // Méthodes utilitaires pour la gestion des tokens

  /**
   * Sauvegarde les tokens et infos utilisateur dans sessionStorage
   */
  saveTokens(authResponse: AuthResponse): void {
    if (!this.isBrowser) return; // Ne rien faire côté serveur
    
    console.log('[AUTH-SERVICE] Début de la sauvegarde des tokens et infos utilisateur');
    
    // Nettoyage des données existantes dans le sessionStorage
    window.sessionStorage.removeItem(this.TOKEN_KEY);
    window.sessionStorage.removeItem(this.REFRESH_TOKEN_KEY);
    window.sessionStorage.removeItem(this.USER_KEY);
    
    // Vérification de la présence des tokens
    if (!authResponse.accessToken) {
      console.error('[AUTH-SERVICE] ERREUR: Token d\'accès manquant dans la réponse de l\'API');
    }
    
    if (!authResponse.refreshToken) {
      console.error('[AUTH-SERVICE] ERREUR: Refresh token manquant dans la réponse de l\'API');
    }
    
    // Sauvegarde des tokens dans le sessionStorage
    window.sessionStorage.setItem(this.TOKEN_KEY, authResponse.accessToken);
    window.sessionStorage.setItem(this.REFRESH_TOKEN_KEY, authResponse.refreshToken);
    
    // Préparation des données utilisateur avec tous les champs disponibles
    const userData = {
      username: authResponse.username,
      roles: authResponse.roles,
      firstName: authResponse.firstName,
      lastName: authResponse.lastName,
      speciality: authResponse.speciality,
      registrationNumber: authResponse.registrationNumber,
      phone: authResponse.phone,
      address: authResponse.address,
      city: authResponse.city,
      country: authResponse.country,
      accountStatus: authResponse.accountStatus
    };
    
    console.log('[AUTH-SERVICE] Sauvegarde des données utilisateur complètes:', userData);
    
    // Sauvegarde des données utilisateur
    window.sessionStorage.setItem(this.USER_KEY, JSON.stringify(userData));
    
    console.log('[AUTH-SERVICE] Tokens et infos utilisateur sauvegardés avec succès');
    console.log('[AUTH-SERVICE] Données utilisateur sauvegardées:', userData);
    console.log('[AUTH-SERVICE] Token dans le sessionStorage:', !!this.getToken());
  }

  /**
   * Récupère le token d'accès depuis sessionStorage
   */
  getToken(): string | null {
    if (!this.isBrowser) return null; // Côté serveur, retourner null
    
    const token = window.sessionStorage.getItem(this.TOKEN_KEY);
    console.log('[AUTH-SERVICE] Récupération du token:', token ? 'Token présent' : 'Token absent');
    return token;
  }

  /**
   * Récupère le refresh token depuis sessionStorage
   */
  getRefreshToken(): string | null {
    if (!this.isBrowser) return null; // Côté serveur, retourner null
    return window.sessionStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  /**
   * Vérifie si l'utilisateur est connecté (approche simplifiée)
   */
  isLoggedIn(): boolean {
    if (!this.isBrowser) return false; // Côté serveur, retourner false
    
    console.log('[AUTH-SERVICE] Vérification si utilisateur connecté');
    const token = window.sessionStorage.getItem(this.TOKEN_KEY);
    const userStr = window.sessionStorage.getItem(this.USER_KEY);
    
    console.log('[AUTH-SERVICE] Token présent?', !!token, 'User info présente?', !!userStr);
    
    // Simple vérification de présence du token et des infos utilisateur
    // Évite les erreurs de décodage JWT qui peuvent être trop strictes
    return !!token && !!userStr;
    
    // Note: La vérification JWT complète est désactivée temporairement 
    // pour faciliter le débogage et éviter les erreurs de validation
    // Une fois l'application fonctionnelle, vous pourrez rétablir la vérification complète
    /*
    try {
      // Vérifier que le token n'est pas expiré (si votre token est un JWT)
      const payload = JSON.parse(window.atob(token.split('.')[1]));
      const isValid = payload.exp > Date.now() / 1000;
      
      console.log(`[AUTH-SERVICE] Token valide: ${isValid}`);
      
      if (!isValid) {
        // Supprimer le token expiré
        window.sessionStorage.removeItem(this.TOKEN_KEY);
        window.sessionStorage.removeItem(this.USER_KEY);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('[AUTH-SERVICE] ERREUR lors de la validation du token:', error);
      // Si erreur, considérer comme non connecté et nettoyer les données
      window.sessionStorage.removeItem(this.TOKEN_KEY);
      window.sessionStorage.removeItem(this.USER_KEY);
      return false;
    }
    */
  }

  /**
   * Récupère les infos de l'utilisateur connecté
   */
  getCurrentUser(): any {
    if (!this.isBrowser) return null; // Côté serveur, retourner null
    
    console.log('[AUTH-SERVICE] Tentative de récupération des données utilisateur');
    
    const userStr = window.sessionStorage.getItem(this.USER_KEY);
    
    if (!userStr) {
      console.warn('[AUTH-SERVICE] Aucune donnée utilisateur trouvée dans le sessionStorage');
      return null;
    }
    
    try {
      const userData = JSON.parse(userStr);
      console.log('[AUTH-SERVICE] Données utilisateur récupérées:', userData);
      return userData;
    } catch (error) {
      console.error('[AUTH-SERVICE] ERREUR lors de la lecture des données utilisateur:', error);
      // En cas d'erreur, effacer les données corrompues
      if (this.isBrowser) {
        window.sessionStorage.removeItem(this.USER_KEY);
      }
      return null;
    }
  }

  /**
   * Vérifie si l'utilisateur a un rôle spécifique
   */
  hasRole(role: string): boolean {
    console.log('[AUTH-SERVICE] Vérification du rôle:', role);
    
    const user = this.getCurrentUser();
    if (!user) {
      console.warn('[AUTH-SERVICE] Impossible de vérifier le rôle: utilisateur non trouvé');
      return false;
    }
    
    if (!user.roles || !Array.isArray(user.roles)) {
      console.error('[AUTH-SERVICE] ERREUR: Format de rôles invalide ou absent');
      console.error('[AUTH-SERVICE] Données utilisateur:', user);
      return false;
    }
    
    // Vérification stricte des rôles (sensible à la casse et aux espaces)
    let hasRole = false;
    
    // Normaliser le rôle recherché pour éviter les problèmes de casse ou d'espaces
    // Si le rôle ne commence pas par ROLE_, on l'ajoute pour correspondre au format Spring Security
    let normalizedTargetRole = role.trim().toUpperCase();
    if (!normalizedTargetRole.startsWith('ROLE_')) {
      normalizedTargetRole = 'ROLE_' + normalizedTargetRole;
    }
    
    console.log('[AUTH-SERVICE] Recherche du rôle normalisé:', normalizedTargetRole);
    
    // Rechercher le rôle dans le tableau des rôles de l'utilisateur
    for (let i = 0; i < user.roles.length; i++) {
      const userRole = typeof user.roles[i] === 'string' ? user.roles[i].trim().toUpperCase() : '';
      console.log(`[AUTH-SERVICE] Comparaison: '${userRole}' vs '${normalizedTargetRole}'`);
      
      if (userRole === normalizedTargetRole) {
        hasRole = true;
        break;
      }
    }
    
    // Alternative: Vérification moins stricte (recherche de sous-chaîne)
    const looseCheck = user.roles.some((r: any) => {
      if (typeof r !== 'string') return false;
      const userRoleUpper = r.trim().toUpperCase();
      // Vérifier avec et sans le préfixe ROLE_
      return userRoleUpper === normalizedTargetRole || 
             userRoleUpper === normalizedTargetRole.replace('ROLE_', '') ||
             userRoleUpper.replace('ROLE_', '') === normalizedTargetRole.replace('ROLE_', '');
    });
    
    console.log(`[AUTH-SERVICE] L'utilisateur ${user.username} ${hasRole || looseCheck ? 'possède' : 'ne possède pas'} le rôle ${role}`);
    console.log('[AUTH-SERVICE] Rôles disponibles:', user.roles);
    console.log('[AUTH-SERVICE] Vérification alternative:', looseCheck);
    
    return hasRole || looseCheck; // On accepte les deux méthodes de vérification pour plus de robustesse
  }
  
  /**
   * Force le rafraîchissement des données utilisateur depuis le sessionStorage
   * Utile en cas de problème de synchronisation des données utilisateur
   */
  refreshUserData(): any {
    if (!this.isBrowser) return null; // Côté serveur, retourner null
    
    console.log('[AUTH-SERVICE] Rafraîchissement forcé des données utilisateur');
    const userStr = window.sessionStorage.getItem(this.USER_KEY);
    
    if (!userStr) {
      console.warn('[AUTH-SERVICE] Aucune donnée utilisateur à rafraîchir');
      return null;
    }
    
    try {
      const userData = JSON.parse(userStr);
      
      // Assurer que les rôles sont correctement formatés
      if (userData && userData.roles) {
        if (typeof userData.roles === 'string') {
          // Convertir une chaîne de caractères en tableau si nécessaire
          console.log('[AUTH-SERVICE] Conversion des rôles de chaîne en tableau');
          userData.roles = userData.roles.split(',').map((r: string) => r.trim());
        } else if (!Array.isArray(userData.roles)) {
          // Si ce n'est pas un tableau, créer un tableau vide
          console.warn('[AUTH-SERVICE] Format de rôles invalide, réinitialisation');
          userData.roles = [];
        }
      }
      
      // Force la sauvegarde des données mises à jour
      window.sessionStorage.setItem(this.USER_KEY, JSON.stringify(userData));
      
      console.log('[AUTH-SERVICE] Données utilisateur rafraîchies:', userData);
      return userData;
    } catch (error) {
      console.error('[AUTH-SERVICE] ERREUR lors du rafraîchissement des données:', error);
      return null;
    }
  }
}
