import { Component, OnInit, HostListener, LOCALE_ID, Inject } from '@angular/core';
import { CommonModule, DatePipe, registerLocaleData } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import localeFr from '@angular/common/locales/fr';

// Enregistrement de la locale française
registerLocaleData(localeFr);
import { AuthService } from '../../../shared/services/auth.service';
import { Professional } from '../../../shared/models/professional.model';

@Component({
  selector: 'app-professional-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, DatePipe],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class ProfessionalDashboardComponent implements OnInit {
  professional: any = null;
  loading = true;
  error = '';
  welcomeMessage = false;
  userName = '';
  sidebarCollapsed = false;
  isMobile = false;
  today: Date = new Date(); // Date actuelle pour l'affichage dans le header

  constructor(
    private authService: AuthService,
    private router: Router,
    @Inject(LOCALE_ID) private locale: string
  ) {
    console.log('[PROFESSIONAL-DASHBOARD] Construction du composant de tableau de bord professionnel');
    console.log('[PROFESSIONAL-DASHBOARD] Route actuelle:', this.router.url);
    
    // Détailler l'état d'authentification
    const isLoggedIn = this.authService.isLoggedIn();
    console.log('[PROFESSIONAL-DASHBOARD] Utilisateur authentifié?', isLoggedIn);
    
    // Vérifier si l'utilisateur est bien connecté
    if (!isLoggedIn) {
      console.error('[PROFESSIONAL-DASHBOARD] SÉCURITÉ: Tentative d\'accès sans authentification');
      console.log('[PROFESSIONAL-DASHBOARD] Token présent?', !!this.authService.getToken());
      console.log('[PROFESSIONAL-DASHBOARD] Redirection vers la page de connexion');
      this.router.navigate(['/auth/login']);
      return;
    }
    
    // Détailler les informations utilisateur
    const currentUser = this.authService.getCurrentUser();
    console.log('[PROFESSIONAL-DASHBOARD] Données utilisateur:', currentUser);
    
    // Détailler les rôles
    const userRoles = currentUser?.roles || [];
    console.log('[PROFESSIONAL-DASHBOARD] Rôles utilisateur:', userRoles);
    const hasProfessionalRole = this.authService.hasRole('ROLE_PROFESSIONAL');
    console.log('[PROFESSIONAL-DASHBOARD] Utilisateur a le rôle PROFESSIONAL?', hasProfessionalRole);
    
    // Vérifier si l'utilisateur a le bon rôle
    if (!hasProfessionalRole) {
      console.error('[PROFESSIONAL-DASHBOARD] SÉCURITÉ: Utilisateur sans le rôle PROFESSIONAL');
      console.log('[PROFESSIONAL-DASHBOARD] Redirection basée sur les rôles disponibles');
      this.navigateBasedOnRole();
      return;
    }
    
    console.log('[PROFESSIONAL-DASHBOARD] Accès autorisé au tableau de bord professionnel');
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkScreenSize();
  }

  /**
   * Vérifie la taille de l'écran et ajuste l'état de la sidebar en conséquence
   */
  checkScreenSize() {
    this.isMobile = window.innerWidth < 992;
    if (this.isMobile && !this.sidebarCollapsed) {
      this.sidebarCollapsed = true;
    }
  }

  /**
   * Bascule l'état de la sidebar entre déplié et replié
   */
  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
    console.log('[PROFESSIONAL-DASHBOARD] Sidebar toggled:', this.sidebarCollapsed ? 'collapsed' : 'expanded');
  }

  ngOnInit(): void {
    console.log('[PROFESSIONAL-DASHBOARD] Début de l\'initialisation du dashboard professionnel');
    
    // Vérifier la taille de l'écran au chargement
    this.checkScreenSize();
    
    // Vérification supplémentaire de l'authentification
    if (!this.authService.isLoggedIn()) {
      console.error('[PROFESSIONAL-DASHBOARD] ERREUR: Utilisateur non connecté lors de l\'initialisation du composant');
      console.log('[PROFESSIONAL-DASHBOARD] Redirection vers la page de connexion');
      this.router.navigate(['/auth/login']);
      return;
    }
    
    // Récupérer les informations de l'utilisateur courant avec vérification complète
    const currentUser = this.authService.getCurrentUser();
    console.log('[PROFESSIONAL-DASHBOARD] Détails de l\'utilisateur courant:', currentUser);
    
    if (!currentUser) {
      console.error('[PROFESSIONAL-DASHBOARD] ERREUR: Données utilisateur manquantes ou invalides');
      console.log('[PROFESSIONAL-DASHBOARD] Vérification du token:', !!this.authService.getToken());
      console.log('[PROFESSIONAL-DASHBOARD] Redirection vers la page de connexion');
      this.router.navigate(['/auth/login']);
      return;
    }
    
    // Vérification supplémentaire des rôles
    if (!this.authService.hasRole('ROLE_PROFESSIONAL')) {
      console.error('[PROFESSIONAL-DASHBOARD] ERREUR: Utilisateur sans rôle professionnel dans ngOnInit');
      console.log('[PROFESSIONAL-DASHBOARD] Rôles disponibles:', currentUser?.roles || []);
      console.log('[PROFESSIONAL-DASHBOARD] Redirection basée sur les rôles');
      this.navigateBasedOnRole();
      return;
    }
    
    // Initialisation des données de l'utilisateur pour l'interface
    this.userName = currentUser.username;
    console.log('[PROFESSIONAL-DASHBOARD] Nom d\'utilisateur récupéré:', this.userName);
    
    // Afficher le message de bienvenue
    this.welcomeMessage = true;
    console.log('[PROFESSIONAL-DASHBOARD] Affichage du message de bienvenue');
    
    // Cacher le message de bienvenue après 5 secondes
    setTimeout(() => {
      console.log('[PROFESSIONAL-DASHBOARD] Masquage du message de bienvenue après délai');
      this.welcomeMessage = false;
    }, 5000);
    
    console.log('[PROFESSIONAL-DASHBOARD] Début du chargement des données professionnelles');
    
    // Chargement direct des données professionnelles depuis l'utilisateur authentifié
    setTimeout(() => {
      this.loading = false;
      
      // Récupération des données complètes depuis currentUser
      console.log('[PROFESSIONAL-DASHBOARD] Données brutes reçues du backend:', currentUser);
      
      this.professional = {
        // Utilisation de tous les champs disponibles dans l'objet AuthResponse
        firstName: currentUser.firstName || currentUser.username || 'Utilisateur',
        lastName: currentUser.lastName || '',
        // L'email est souvent identique au username dans les systèmes d'authentification
        email: currentUser.username, // Utilisation directe du username comme email
        speciality: currentUser.speciality || 'Médecine générale',
        registrationNumber: currentUser.registrationNumber || 'N/A',
        phone: currentUser.phone || 'N/A',
        address: currentUser.address || 'N/A',
        city: currentUser.city || 'N/A',
        country: currentUser.country || 'France',
        accountStatus: currentUser.accountStatus || 'VERIFIED',
        // Ajout des statistiques pour le tableau de bord (données simulées)
        stats: {
          pendingRequests: 12,
          completedRequests: 45,
          upcomingAppointments: 8,
          pendingAmount: '2 450 €'
        }
      };
      
      console.log('[PROFESSIONAL-DASHBOARD] Email utilisé:', currentUser.username);
      console.log('[PROFESSIONAL-DASHBOARD] Données professionnelles traitées:', this.professional);
      
      // Vérification de sécurité pour s'assurer que les données sont valides
      if (!this.professional.firstName || !this.professional.lastName) {
        console.warn('[PROFESSIONAL-DASHBOARD] SÉCURITÉ: Données professionnelles incomplètes');
      }
    }, 1000);
  }

  /**
   * Déconnecte l'utilisateur et le redirige vers la page de connexion
   */
  logout(): void {
    console.log('[PROFESSIONAL-DASHBOARD] Déconnexion de l\'utilisateur en cours...');
    // Vérifier l'authentification avant la déconnexion
    if (this.authService.isLoggedIn()) {
      const currentUser = this.authService.getCurrentUser();
      console.log('[PROFESSIONAL-DASHBOARD] Déconnexion de l\'utilisateur:', currentUser?.username);
    } else {
      console.warn('[PROFESSIONAL-DASHBOARD] Tentative de déconnexion alors que l\'utilisateur n\'est pas connecté');
    }
    
    this.authService.logout();
    console.log('[PROFESSIONAL-DASHBOARD] Déconnexion effectuée, redirection vers la page de connexion');
    this.router.navigate(['/auth/login']);
  }
  
  /**
   * Redirige l'utilisateur vers le tableau de bord approprié en fonction de ses rôles
   */
  navigateBasedOnRole(): void {
    const userRoles = this.authService.getCurrentUser()?.roles || [];
    console.log('[PROFESSIONAL-DASHBOARD] Redirection basée sur les rôles:', userRoles);
    
    // Déterminer la redirection en fonction des rôles disponibles
    if (userRoles.includes('ROLE_ADMIN')) {
      console.log('[PROFESSIONAL-DASHBOARD] Rôle ADMIN détecté, redirection vers le tableau de bord administrateur');
      this.router.navigate(['/admin/dashboard']).then(
        success => console.log('[PROFESSIONAL-DASHBOARD] Redirection vers admin dashboard réussie?', success),
        error => console.error('[PROFESSIONAL-DASHBOARD] Erreur lors de la redirection vers admin dashboard:', error)
      );
    } else if (userRoles.includes('ROLE_USER')) {
      console.log('[PROFESSIONAL-DASHBOARD] Rôle USER détecté, redirection vers le tableau de bord utilisateur');
      this.router.navigate(['/user/dashboard']).then(
        success => console.log('[PROFESSIONAL-DASHBOARD] Redirection vers user dashboard réussie?', success),
        error => console.error('[PROFESSIONAL-DASHBOARD] Erreur lors de la redirection vers user dashboard:', error)
      );
    } else {
      console.log('[PROFESSIONAL-DASHBOARD] Aucun rôle spécifique détecté, redirection vers la page d\'accueil');
      this.router.navigate(['/']).then(
        success => console.log('[PROFESSIONAL-DASHBOARD] Redirection vers la page d\'accueil réussie?', success),
        error => console.error('[PROFESSIONAL-DASHBOARD] Erreur lors de la redirection vers la page d\'accueil:', error)
      );
    }
  }
}
