import { Component, HostListener, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../shared/services/auth.service';

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

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Vérifier la position du scroll au chargement
    this.checkScroll();
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
   * Récupère l'utilisateur connecté
   */
  getCurrentUser(): any {
    return this.authService.getCurrentUser();
  }

  /**
   * Vérifie si l'utilisateur a un rôle spécifique
   */
  hasRole(role: string): boolean {
    return this.authService.hasRole(role);
  }
}
