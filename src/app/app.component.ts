import { Component, OnInit } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './components/shared/navbar/navbar.component';
import { FooterComponent } from './components/shared/footer/footer.component';
import { AuthService } from './shared/services/auth.service';
import { filter } from 'rxjs/operators';
import * as AOS from 'aos';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'arma-care-frontend';
  showNavbarAndFooter = true;
  
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // Initialisation de AOS (Animate On Scroll)
    AOS.init({
      duration: 800,     // durée de l'animation en ms
      easing: 'ease-out-cubic',   // type d'easing
      once: false,       // l'animation se joue à chaque défilement
      offset: 50,        // décalage (en px) par rapport au point de déclenchement
      delay: 0,          // délai avant l'animation
      anchorPlacement: 'top-bottom', // définit quelle position de l'élément par rapport à la fenêtre doit déclencher l'animation
    });
    
    // Surveillance des changements de route pour afficher/masquer la navbar et footer
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      const url = this.router.url;
      const isLoggedIn = this.authService.isLoggedIn();
      
      // Masquer navbar et footer sur les tableaux de bord
      this.showNavbarAndFooter = !(isLoggedIn && 
        (url.includes('/admin/dashboard') || url.includes('/professional/dashboard')));
      
      console.log(`[APP] Navbar et footer ${this.showNavbarAndFooter ? 'affichés' : 'masqués'} - URL: ${url}`);
    });
    
    // Vérifier s'il existe un administrateur au démarrage
    this.checkForAdminExistence();
  }
  
  /**
   * Vérifie si un administrateur existe dans le système
   * Redirige vers la page de création du premier administrateur si aucun n'existe
   * Cette vérification n'est effectuée que sur des pages non-protégées
   */
  private checkForAdminExistence(): void {
    // Ne pas vérifier si l'utilisateur est déjà sur la page first-admin
    if (this.router.url === '/auth/first-admin') {
      return;
    }
    
    // Ne pas vérifier si l'utilisateur est déjà connecté
    if (this.authService.isLoggedIn()) {
      return;
    }
    
    console.log('[APP] Vérification de l\'existence d\'un administrateur');
    this.authService.checkAdminExists().subscribe({
      next: (response) => {
        if (!response.adminExists) {
          console.log('[APP] Aucun administrateur trouvé, redirection vers la page de création du premier administrateur');
          this.router.navigate(['/auth/first-admin']);
        } else {
          console.log('[APP] Un administrateur existe déjà dans le système');
        }
      },
      error: (err) => {
        console.error('[APP] Erreur lors de la vérification d\'existence d\'admin:', err);
      }
    });
  }
}
