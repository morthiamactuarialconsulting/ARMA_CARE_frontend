import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../shared/services/auth.service';
import { Professional } from '../../../shared/models/professional.model';

@Component({
  selector: 'app-professional-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class ProfessionalDashboardComponent implements OnInit {
  professional: any = null;
  loading = true;
  error = '';
  welcomeMessage = false;
  userName = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    console.log('ProfessionalDashboardComponent construit');
    // Vérifier si l'utilisateur est bien connecté
    if (!this.authService.isLoggedIn()) {
      console.error('Utilisateur non connecté, redirection vers login');
      this.router.navigate(['/auth/login']);
      return;
    }
    
    // Vérifier si l'utilisateur a le bon rôle
    if (!this.authService.hasRole('ROLE_PROFESSIONAL')) {
      console.error('Utilisateur sans rôle professionnel, redirection basée sur rôle');
      this.navigateBasedOnRole();
      return;
    }
  }

  ngOnInit(): void {
    console.log('Initialisation du dashboard professionnel');
    // Récupérer les informations de l'utilisateur courant
    const currentUser = this.authService.getCurrentUser();
    console.log('Utilisateur courant:', currentUser);
    
    if (currentUser) {
      this.userName = currentUser.username;
      this.welcomeMessage = true;
      
      // Cacher le message de bienvenue après 5 secondes
      setTimeout(() => {
        this.welcomeMessage = false;
      }, 5000);
    }
    
    // Simulation de chargement des données professionnelles
    setTimeout(() => {
      this.loading = false;
      this.professional = {
        firstName: currentUser?.username || 'Utilisateur',
        lastName: 'Professionnel',
        email: currentUser?.email,
        speciality: 'Médecine générale',
        accountStatus: 'VERIFIED'
      };
      console.log('Données professionnelles chargées:', this.professional);
    }, 1000);
  }

  logout(): void {
    console.log('Déconnexion en cours...');
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
  
  navigateBasedOnRole(): void {
    const userRoles = this.authService.getCurrentUser()?.roles || [];
    console.log('Redirection basée sur les rôles:', userRoles);
    
    if (userRoles.includes('ROLE_ADMIN')) {
      this.router.navigate(['/admin/dashboard']);
    } else if (userRoles.includes('ROLE_USER')) {
      this.router.navigate(['/user/dashboard']);
    } else {
      this.router.navigate(['/']);
    }
  }
}
