import { Component, HostListener, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
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

  currentUser: any = null;
  
  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Vérifier la position du scroll au chargement
    this.checkScroll();
    
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
    this.scrolled = window.scrollY > 50;
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
    document.body.style.overflow = this.menuOpen ? 'hidden' : '';
  }

  /**
   * Ferme le menu mobile
   */
  closeMenu(): void {
    if (this.menuOpen) {
      this.menuOpen = false;
      this.dropdownOpen = false;
      this.userDropdownOpen = false;
      document.body.style.overflow = '';
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
   * Récupère le nom pour l'affichage
   */
  getUserName(): string {
    const user = this.getCurrentUser();
    
    if (user) {
      // Priorité au nom complet s'il existe
      if (user.fullName) {
        return user.fullName;
      }
      // Sinon, combiner prénom et nom
      else if (user.firstName || user.lastName) {
        return `${user.firstName || ''} ${user.lastName || ''}`.trim();
      }
      // Fallback vers l'email ou le nom d'utilisateur
      else if (user.email) {
        // Afficher la partie avant @ de l'email
        return user.email.split('@')[0];
      }
      else if (user.username) {
        return user.username;
      }
    }
    
    return 'Utilisateur'; // Fallback
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
