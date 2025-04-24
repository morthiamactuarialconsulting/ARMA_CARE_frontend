import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  private readonly API_URL = `${environment.apiUrl}/documents`;

  constructor(private http: HttpClient) { }

  /**
   * Récupère un document depuis le serveur
   * @param category Catégorie du document (ex: identity, diploma, license)
   * @param professionalId Identifiant du professionnel
   * @param filename Nom du fichier
   */
  getDocument(category: string, professionalId: number, filename: string): Observable<Blob> {
    return this.http.get(`${this.API_URL}/${category}/${professionalId}/${filename}`, {
      responseType: 'blob'
    });
  }

  /**
   * Prépare un FormData pour l'envoi de fichiers lors de l'inscription
   * @param professionalData Données du professionnel
   * @param files Fichiers à envoyer (carte d'identité, diplôme, licence, etc.)
   */
  prepareRegistrationFormData(professionalData: any, files: { [key: string]: File }): FormData {
    const formData: FormData = new FormData();
    
    // Ajout des données du professionnel
    Object.keys(professionalData).forEach(key => {
      formData.append(key, professionalData[key]);
    });
    
    // Ajout des fichiers
    Object.keys(files).forEach(key => {
      if (files[key]) {
        formData.append(key, files[key], files[key].name);
      }
    });
    
    return formData;
  }

  /**
   * Télécharge un document en local (côté client)
   * @param blob Données binaires du document
   * @param filename Nom du fichier pour le téléchargement
   */
  downloadDocument(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

  /**
   * Convertit un Blob en URL pour affichage dans le navigateur
   * @param blob Données binaires du document
   */
  createObjectURL(blob: Blob): string {
    return window.URL.createObjectURL(blob);
  }
}
