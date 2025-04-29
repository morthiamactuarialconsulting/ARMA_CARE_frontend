import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { Professional } from '../models/professional.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  professional: any = null;
  loading = true;
  error = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Vérification de l'authentification
    if (!this.authService.isLoggedIn()) {
      console.error('[PROFILE] ERREUR: Utilisateur non connecté lors de l\'initialisation du composant');
      this.router.navigate(['/auth/login']);
      return;
    }
    
    // Chargement des données de l'utilisateur
    this.loadUserData();
  }

  /**
   * Charge les données de l'utilisateur connecté
   */
  loadUserData(): void {
    this.loading = true;
    const currentUser = this.authService.getCurrentUser();
    
    if (!currentUser) {
      this.error = 'Impossible de récupérer les informations utilisateur';
      this.loading = false;
      return;
    }
    
    // Simulation d'un délai de chargement (pourrait être remplacé par un appel API réel)
    setTimeout(() => {
      this.professional = {
        firstName: currentUser.firstName || currentUser.username || 'Utilisateur',
        lastName: currentUser.lastName || '',
        email: currentUser.username, // Utilisation du username comme email
        speciality: currentUser.speciality || 'Médecine générale',
        registrationNumber: currentUser.registrationNumber || 'N/A',
        phone: currentUser.phone || 'N/A',
        address: currentUser.address || 'N/A',
        city: currentUser.city || 'N/A',
        country: currentUser.country || 'France',
        accountStatus: currentUser.accountStatus || 'VERIFIED'
      };
      
      this.loading = false;
    }, 500);
  }
}
