import { Component, HostListener, OnInit, Inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../../shared/services/auth.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {
  scrolled = false;
  menuOpen = false;
  dropdownOpen = false;
  userDropdownOpen = false;
  private isBrowser: boolean;
  currentUser: any = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    // Vérifier l'état du scroll au chargement uniquement côté navigateur
    if (this.isBrowser) {
      this.checkScroll();
    }
  }

  ngOnInit(): void {
    // Récupérer les informations utilisateur au démarrage
    this.updateUserInfo();
    // Mettre à jour les informations utilisateur à chaque changement de route
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updateUserInfo();
    });
  }

  /**
   * Surveille le scroll de la page pour changer l'apparence de la navbar
   */
  @HostListener('window:scroll')
  checkScroll(): void {
    if (this.isBrowser) {
      this.scrolled = window.scrollY > 50;
    }
  }

  /**
   * Bascule l'état du menu mobile
   */
  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
    // Ferme les dropdowns si le menu est fermé
    if (!this.menuOpen) {
      this.dropdownOpen = false;
      this.userDropdownOpen = false;
    }
    // Empêche le défilement du corps quand le menu est ouvert
    if (this.isBrowser) {
      document.body.style.overflow = this.menuOpen ? 'hidden' : '';
    }
  }

  /**
   * Ferme le menu mobile
   */
  closeMenu(): void {
    if (this.menuOpen) {
      this.menuOpen = false;
      this.dropdownOpen = false;
      this.userDropdownOpen = false;
      if (this.isBrowser) {
        document.body.style.overflow = '';
      }
    }
  }

  /**
   * Bascule l'état du menu déroulant des ressources
   */
  toggleDropdown(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.dropdownOpen = !this.dropdownOpen;
    // Ferme le dropdown utilisateur si ouvert
    if (this.userDropdownOpen) {
      this.userDropdownOpen = false;
    }
  }

  /**
   * Bascule l'état du menu déroulant utilisateur
   */
  toggleUserDropdown(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.userDropdownOpen = !this.userDropdownOpen;
    // Ferme le dropdown des ressources si ouvert
    if (this.dropdownOpen) {
      this.dropdownOpen = false;
    }
  }

  /**
   * Déconnecte l'utilisateur
   */
  logout(): void {
    this.authService.logout();
    this.currentUser = null;
    this.router.navigate(['/']);
    this.closeMenu();
  }

  /**
   * Vérifie si l'utilisateur est connecté
   */
  isLoggedIn(): boolean {
    if (!this.isBrowser) return false; // Côté serveur, considérer comme non connecté
    return this.authService.isLoggedIn();
  }

  /**
   * Mise à jour des informations utilisateur
   */
  updateUserInfo(): void {
    if (this.isLoggedIn()) {
      this.currentUser = this.authService.getCurrentUser();
      console.log('User info updated in navbar:', this.currentUser);
      this.cdr.detectChanges();
      
      // Si l'utilisateur est connecté et a le rôle de professionnel mais est sur la page d'accueil
      // le rediriger automatiquement vers son tableau de bord
      if (this.hasRole('ROLE_PROFESSIONAL') && this.router.url === '/') {
        console.log('Redirection automatique vers le tableau de bord professionnel');
        this.router.navigate(['/professional/dashboard']);
      }
    } else {
      this.currentUser = null;
    }
  }

  /**
   * Récupère l'utilisateur connecté
   */
  getCurrentUser(): any {
    return this.currentUser || this.authService.getCurrentUser();
  }
  
  /**
   * Récupère les initiales de l'utilisateur pour l'avatar
   */
  getUserInitial(): string {
    const user = this.getCurrentUser();
    
    // Si l'utilisateur a un prénom ou nom, utiliser leurs initiales
    if (user) {
      // Vérifier si nous avons un prénom/nom dans le profil utilisateur
      if (user.firstName && user.lastName) {
        return (user.firstName.charAt(0) + user.lastName.charAt(0)).toUpperCase();
      } else if (user.firstName) {
        return user.firstName.charAt(0).toUpperCase();
      } else if (user.lastName) {
        return user.lastName.charAt(0).toUpperCase();
      } else if (user.fullName) {
        // Si nous avons un nom complet, prendre les initiales
        const nameParts = user.fullName.split(' ');
        if (nameParts.length >= 2) {
          return (nameParts[0].charAt(0) + nameParts[1].charAt(0)).toUpperCase();
        } else {
          return nameParts[0].charAt(0).toUpperCase();
        }
      } else if (user.email) {
        // Utiliser la première lettre de l'email
        return user.email.charAt(0).toUpperCase();
      } else if (user.username) {
        // Fallback vers le nom d'utilisateur
        return user.username.charAt(0).toUpperCase();
      }
    }
    
    return 'U'; // Fallback si aucune donnée disponible
  }
  
  /**
   * Récupère le nom pour l'affichage dans la navbar
   * Priorité absolue au prénom et nom reçus du backend
   */
  getUserName(): string {
    const user = this.getCurrentUser();
    
    if (!user) {
      return 'Utilisateur'; // Fallback si aucun utilisateur trouvé
    }
    
    // Vérifier si le prénom existe seul (priorité 1)
    if (user.firstName && !user.lastName) {
      console.log('[NAVBAR] Affichage du prénom uniquement:', user.firstName);
      return user.firstName;
    }
    
    // Prénom et nom de famille ensemble (priorité 2)
    if (user.firstName && user.lastName) {
      console.log('[NAVBAR] Affichage prénom et nom:', `${user.firstName} ${user.lastName}`);
      return `${user.firstName} ${user.lastName}`;
    }
    
    // Seulement le nom de famille si disponible (priorité 3)
    if (user.lastName) {
      console.log('[NAVBAR] Affichage du nom de famille uniquement:', user.lastName);
      return user.lastName;
    }
    
    // Nom complet si disponible (priorité 4)
    if (user.fullName) {
      console.log('[NAVBAR] Affichage du nom complet:', user.fullName);
      return user.fullName;
    }
    
    // Fallbacks
    if (user.email) {
      const emailName = user.email.split('@')[0];
      console.log('[NAVBAR] Fallback vers email:', emailName);
      return emailName;
    }
    
    if (user.username) {
      console.log('[NAVBAR] Fallback vers username:', user.username);
      return user.username;
    }
    
    console.log('[NAVBAR] Aucune information nominative trouvée, utilisation du fallback');
    return 'Utilisateur'; // Fallback final
  }

  /**
   * Vérifie si l'utilisateur a un rôle spécifique
   * Vérification stricte pour assurer la sécurité de l'application
   */
  hasRole(role: string): boolean {
    // Vérification sécurisée des rôles utilisateur
    const user = this.authService.getCurrentUser();
    if (user && user.roles) {
      const hasRole = user.roles.includes(role);
      console.log(`Vérification du rôle ${role} pour l'utilisateur:`, hasRole);
      return hasRole;
    }
    return false;
  }
}
