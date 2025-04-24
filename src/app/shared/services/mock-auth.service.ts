import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { LoginRequest } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class MockAuthService {
  private readonly TOKEN_KEY = 'auth-token';
  private readonly USER_KEY = 'auth-user';
  
  // Utilisateurs de test
  private mockUsers = [
    {
      id: 1,
      username: 'admin',
      password: 'admin123',
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@armacare.com',
      roles: ['ROLE_ADMIN']
    },
    {
      id: 2,
      username: 'doctor',
      password: 'doctor123',
      firstName: 'Dr. Jean',
      lastName: 'Dupont',
      email: 'jean.dupont@armacare.com',
      speciality: 'Cardiologie',
      roles: ['ROLE_PROFESSIONAL']
    }
  ];

  constructor() { }

  /**
   * Simule une connexion
   */
  login(credentials: LoginRequest): Observable<any> {
    const { username, password } = credentials;
    const user = this.mockUsers.find(u => u.username === username && u.password === password);

    if (user) {
      // Générer un token factice
      const token = `mock-jwt-token-${Date.now()}`;
      const refreshToken = `mock-refresh-token-${Date.now()}`;
      
      // Sauvegarder dans le sessionStorage
      this.saveToken(token);
      this.saveUser({
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        roles: user.roles
      });

      return of({
        id: user.id,
        username: user.username,
        email: user.email,
        roles: user.roles,
        accessToken: token,
        refreshToken: refreshToken
      }).pipe(delay(800)); // Simuler un délai réseau
    }

    // Échec de connexion
    return throwError(() => new Error('Nom d\'utilisateur ou mot de passe incorrect')).pipe(delay(800));
  }

  /**
   * Simuler une inscription
   */
  register(userData: any): Observable<any> {
    // Vérifier si l'utilisateur existe déjà
    const userExists = this.mockUsers.some(
      u => u.username === userData.username || u.email === userData.email
    );

    if (userExists) {
      return throwError(() => new Error('L\'utilisateur existe déjà')).pipe(delay(800));
    }

    // Simuler la création d'un nouvel utilisateur
    const newUser = {
      id: this.mockUsers.length + 1,
      ...userData,
      roles: ['ROLE_PROFESSIONAL']
    };

    // Ajouter à notre liste d'utilisateurs
    this.mockUsers.push(newUser);

    return of({
      message: 'Inscription réussie! Votre compte est en attente de vérification.'
    }).pipe(delay(1200)); // Délai plus long pour simuler l'upload de fichiers
  }

  /**
   * Simuler un enregistrement avec fichiers
   */
  registerWithFiles(formData: FormData): Observable<any> {
    const userData = {
      username: formData.get('username') as string,
      password: formData.get('password') as string,
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      email: formData.get('email') as string,
      speciality: formData.get('speciality') as string,
      roles: ['ROLE_PROFESSIONAL']
    };

    return this.register(userData);
  }

  /**
   * Déconnexion - supprime les tokens et infos user
   */
  logout(): void {
    window.sessionStorage.removeItem(this.TOKEN_KEY);
    window.sessionStorage.removeItem(this.USER_KEY);
  }

  /**
   * Vérifie si l'utilisateur est connecté
   */
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  /**
   * Vérifie si l'utilisateur a un rôle spécifique
   */
  hasRole(role: string): boolean {
    const user = this.getUser();
    return user && user.roles && user.roles.includes(role);
  }

  /**
   * Fonctions utilitaires pour gérer le token et l'utilisateur
   */
  private saveToken(token: string): void {
    window.sessionStorage.setItem(this.TOKEN_KEY, token);
  }

  private getToken(): string | null {
    return window.sessionStorage.getItem(this.TOKEN_KEY);
  }

  private saveUser(user: any): void {
    window.sessionStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  getUser(): any {
    const userStr = window.sessionStorage.getItem(this.USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  }
}
