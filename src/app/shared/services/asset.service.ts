import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AssetService {
  private baseUrl = window.location.origin;

  constructor() {}

  /**
   * Retourne l'URL complète pour un asset
   * Cette méthode garantit que les assets seront correctement chargés
   * quelle que soit la configuration du déploiement
   */
  getAssetUrl(relativePath: string): string {
    // Supprimer le slash initial si présent
    if (relativePath.startsWith('/')) {
      relativePath = relativePath.substring(1);
    }
    
    return `${this.baseUrl}/${relativePath}`;
  }
}
