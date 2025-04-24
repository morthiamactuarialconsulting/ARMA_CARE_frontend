import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { 
  LoginRequest, 
  PasswordChangeRequest, 
  PasswordResetConfirmRequest, 
  PasswordResetRequest 
} from '../models/auth.model';

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  username: string;
  roles: string[];
  id?: number;
  email?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly AUTH_API = `${environment.apiUrl}/auth`;
  private readonly TOKEN_KEY = 'auth-token';
  private readonly REFRESH_TOKEN_KEY = 'auth-refresh-token';
  private readonly USER_KEY = 'auth-user';

  constructor(private http: HttpClient) { }

  /**
   * Connexion utilisateur
   */
  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.AUTH_API}/login`, credentials)
      .pipe(
        tap(response => this.saveTokens(response))
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
    window.sessionStorage.removeItem(this.TOKEN_KEY);
    window.sessionStorage.removeItem(this.REFRESH_TOKEN_KEY);
    window.sessionStorage.removeItem(this.USER_KEY);
    
    window.sessionStorage.setItem(this.TOKEN_KEY, authResponse.accessToken);
    window.sessionStorage.setItem(this.REFRESH_TOKEN_KEY, authResponse.refreshToken);
    window.sessionStorage.setItem(this.USER_KEY, JSON.stringify({
      id: authResponse.id,
      username: authResponse.username,
      email: authResponse.email,
      roles: authResponse.roles
    }));
  }

  /**
   * Récupère le token d'accès depuis sessionStorage
   */
  getToken(): string | null {
    return window.sessionStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Récupère le refresh token depuis sessionStorage
   */
  getRefreshToken(): string | null {
    return window.sessionStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  /**
   * Vérifie si l'utilisateur est connecté
   */
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  /**
   * Récupère les infos de l'utilisateur connecté
   */
  getCurrentUser(): any {
    const userStr = window.sessionStorage.getItem(this.USER_KEY);
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  }

  /**
   * Vérifie si l'utilisateur a un rôle spécifique
   */
  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    if (user && user.roles) {
      return user.roles.includes(role);
    }
    return false;
  }
}
