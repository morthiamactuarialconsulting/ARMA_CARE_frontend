import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Professional, AccountStatus } from '../../shared/models/professional.model';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../shared/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }
  
  // Méthode privée pour obtenir les headers avec le token JWT
  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    console.log('[ADMIN-SERVICE] Token récupéré:', token ? 'Token présent' : 'TOKEN ABSENT');
    
    // Si le token est absent, essayons de vérifier si l'utilisateur est connecté
    if (!token) {
      console.warn('[ADMIN-SERVICE] Aucun token JWT trouvé - vérification du statut de connexion');
      const isLoggedIn = this.authService.isLoggedIn();
      console.warn(`[ADMIN-SERVICE] Status de connexion: ${isLoggedIn ? 'Connecté' : 'NON connecté'}`);
    }
    
    return new HttpHeaders({
      'Authorization': `Bearer ${token || ''}` // Éviter d'envoyer 'Bearer null' si token est null
    });
  }

  // Récupérer tous les professionnels
  getAllProfessionals(): Observable<Professional[]> {
    return this.http.get<Professional[]>(`${this.apiUrl}/professionals`, {
      headers: this.getAuthHeaders()
    });
  }

  // Récupérer les professionnels par statut
  getProfessionalsByStatus(status: AccountStatus): Observable<Professional[]> {
    return this.http.get<Professional[]>(`${this.apiUrl}/professionals/by-status?status=${status}`, {
      headers: this.getAuthHeaders()
    });
  }

  // Récupérer un professionnel par ID
  getProfessionalById(id: number): Observable<Professional> {
    return this.http.get<Professional>(`${this.apiUrl}/professionals/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  // Approuver un professionnel (changer le statut à ACTIVE)
  approveProfessional(id: number): Observable<Professional> {
    return this.http.put<Professional>(`${this.apiUrl}/professionals/${id}/activate`, {}, {
      headers: this.getAuthHeaders()
    });
  }

  // Rejeter un professionnel (changer le statut à REJECTED avec une raison)
  rejectProfessional(id: number, reason: string): Observable<Professional> {
    return this.http.put<Professional>(`${this.apiUrl}/professionals/${id}/reject`, { reason }, {
      headers: this.getAuthHeaders()
    });
  }

  // Suspendre un professionnel (changer le statut à SUSPENDED avec une raison)
  suspendProfessional(id: number, reason: string): Observable<Professional> {
    return this.http.put<Professional>(`${this.apiUrl}/professionals/${id}/suspend`, { reason }, {
      headers: this.getAuthHeaders()
    });
  }
  
  // Désactiver définitivement un compte professionnel (passage au statut INACTIVE)
  deactivateProfessional(id: number, reason: string): Observable<Professional> {
    return this.http.put<Professional>(`${this.apiUrl}/professionals/${id}/deactivate`, { reason }, {
      headers: this.getAuthHeaders()
    });
  }
  
  // Archiver définitivement un professionnel (suppression logique)
  archiveProfessional(id: number): Observable<boolean> {
    return this.http.delete(`${this.apiUrl}/professionals/${id}`, {
      headers: this.getAuthHeaders()
    })
      .pipe(
        map(() => true)
      );
  }

  // Vérifier si au moins un administrateur existe dans le système
  checkAdminExists(): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/auth/admin-exists`, {
      headers: this.getAuthHeaders()
    });
  }

  // Créer le premier administrateur du système
  createFirstAdmin(adminData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/register-first-admin`, adminData);
  }

  // Ajouter un nouvel administrateur (requiert des privilèges admin)
  addAdmin(adminData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/register-admin`, adminData, {
      headers: this.getAuthHeaders()
    });
  }

  // Récupérer la liste des administrateurs
  getAllAdmins(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/auth/admins`, {
      headers: this.getAuthHeaders()
    });
  }
  
  // Récupérer des statistiques sur les professionnels
  getProfessionalsStatistics(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/professionals/statistics`, {
      headers: this.getAuthHeaders()
    });
  }
  
  // Récupérer les professionnels par spécialité
  getProfessionalsBySpeciality(speciality: string): Observable<Professional[]> {
    return this.http.get<Professional[]>(`${this.apiUrl}/professionals/by-speciality`, {
      params: { speciality },
      headers: this.getAuthHeaders()
    });
  }

  // Récupérer les professionnels par ville
  getProfessionalsByCity(city: string): Observable<Professional[]> {
    return this.http.get<Professional[]>(`${this.apiUrl}/professionals/by-city`, {
      params: { city },
      headers: this.getAuthHeaders()
    });
  }

  // Mettre à jour les informations d'un professionnel
  updateProfessionalInfo(id: number, professionalData: Partial<Professional>): Observable<Professional> {
    return this.http.put<Professional>(`${this.apiUrl}/professionals/${id}`, professionalData, {
      headers: this.getAuthHeaders()
    });
  }

  // Télécharger un document spécifique d'un professionnel
  downloadProfessionalDocument(professionalId: number, documentType: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/documents/download/${professionalId}/${documentType}`, {
      responseType: 'blob',
      headers: this.getAuthHeaders()
    });
  }
}
