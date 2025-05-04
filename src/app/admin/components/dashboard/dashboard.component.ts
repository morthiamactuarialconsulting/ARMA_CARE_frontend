import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, HostListener, TemplateRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, Validators, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, finalize, of } from 'rxjs';
import { trigger, transition, style, animate } from '@angular/animations';

import { Professional, AccountStatus } from '../../../shared/models/professional.model';
import { AdminService } from '../../services/admin.service';
import { AuthService } from '../../../shared/services/auth.service';
import { StatsCardsComponent } from '../stats-cards/stats-cards.component';
import { ProfessionalDetailsModalComponent } from './professional-details-modal.component';
declare var bootstrap: any;

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe, StatsCardsComponent, ProfessionalDetailsModalComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms', style({ opacity: 0 }))
      ])
    ]),
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateY(-20px)', opacity: 0 }),
        animate('200ms ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ transform: 'translateY(-20px)', opacity: 0 }))
      ])
    ])
  ]
})
export class AdminDashboardComponent implements OnInit, AfterViewInit {
  // Getters pour les statistiques du dashboard
  get totalCount(): number {
    return this.professionals.length;
  }
  get pendingCount(): number {
    return this.professionals.filter(p => p.accountStatus === this.AccountStatus.PENDING_VERIFICATION).length;
  }
  get activeCount(): number {
    return this.professionals.filter(p => p.accountStatus === this.AccountStatus.ACTIVE).length;
  }
  get rejectedCount(): number {
    return this.professionals.filter(p => p.accountStatus === this.AccountStatus.REJECTED).length;
  }
  get suspendedCount(): number {
    return this.professionals.filter(p => p.accountStatus === this.AccountStatus.SUSPENDED).length;
  }
  get inactiveCount(): number {
    return this.professionals.filter(p => p.accountStatus === this.AccountStatus.INACTIVE).length;
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkScreenSize();
  }
  // Définition des statuts de compte pour l'utilisation dans le template
  AccountStatus = AccountStatus;

  professionals: Professional[] = [];
  filteredProfessionals: Professional[] = [];
  searchQuery: string = '';
  currentTab: string = 'pending'; // Options: 'pending', 'active', 'rejected', 'suspended', 'inactive', 'all'
  loading: boolean = true;
  error: string | null = null;
  successMessage: string | null = null;
  specialityFilter: string = 'all';
  availableSpecialities: string[] = [];
  
  // Propriétés pour la sidebar
  sidebarCollapsed = false;
  isMobile: boolean = false;
  activeSection = 'dashboard'; // 'dashboard', 'professionals', 'professionals-stats', 'rapports', etc.
  
  // Gestion des sous-menus
  submenuOpen: { [key: string]: boolean } = {
    'professionals': false
  };
  
  // Données pour les statistiques et tendances
  lastRefreshed: Date = new Date();

  // Variables pour les modals Bootstrap
  @ViewChild('rejectModal') rejectModalRef!: ElementRef;
  @ViewChild('suspendModal') suspendModalRef!: ElementRef;
  @ViewChild('detailsModal') detailsModalRef!: ElementRef;
  @ViewChild('confirmModal') confirmModalRef!: ElementRef;
  @ViewChild('proDetailsModal') proDetailsModalRef!: ElementRef;

  // Données des modals
  selectedProfessional: Professional | null = null;
  rejectReason: string = '';
  suspendReason: string = '';
  currentProfessional: Professional | null = null;
  reasonText: string = '';

  // Références aux instances de modals
  private rejectModal: any;
  private suspendModal: any;
  private detailsModal: any;
  private confirmModal: any;
  private proDetailsModal: any;

  constructor(
    private adminService: AdminService,
    public authService: AuthService
  ) { }

  ngOnInit(): void {
    // Vérifier l'état d'authentification avant le chargement
    const token = this.authService.getToken();
    console.log('[ADMIN-DASHBOARD] État d\'authentification au chargement:', this.authService.isLoggedIn() ? 'Connecté' : 'NON CONNECTÉ');
    console.log('[ADMIN-DASHBOARD] Token JWT:', token ? 'Présent' : 'ABSENT');
    
    // Si pas de token, essayer de réinitialiser le processus d'authentification
    if (!token) {
      console.warn('[ADMIN-DASHBOARD] Token manquant! Redirection vers login recommandée');
    }
    
    // Vérifier la taille de l'écran au chargement
    this.checkScreenSize();
    
    // Ajouter un écouteur d'événement pour le redimensionnement
    window.addEventListener('resize', this.onResize.bind(this));
    
    this.loadProfessionals();
  }

  ngAfterViewInit(): void {
    // Initialiser les modals Bootstrap
    if (this.rejectModalRef) {
      this.rejectModal = new bootstrap.Modal(this.rejectModalRef.nativeElement);
    }
    if (this.suspendModalRef) {
      this.suspendModal = new bootstrap.Modal(this.suspendModalRef.nativeElement);
    }
    if (this.detailsModalRef) {
      this.detailsModal = new bootstrap.Modal(this.detailsModalRef.nativeElement);
    }
    if (this.confirmModalRef) {
      this.confirmModal = new bootstrap.Modal(this.confirmModalRef.nativeElement);
    }
    if (this.proDetailsModalRef) {
      this.proDetailsModal = new bootstrap.Modal(this.proDetailsModalRef.nativeElement);
    }
  }

  // Charger tous les professionnels
  loadProfessionals() {
    this.loading = true;
    console.log('[DASHBOARD] Début du chargement des professionnels...');
    
    this.adminService.getAllProfessionals()
      .pipe(
        catchError(error => {
          console.error('[DASHBOARD] Erreur détaillée lors du chargement des professionnels:', error);
          
          // Analyse détaillée de l'erreur
          if (error.status === 0) {
            console.error('[DASHBOARD] Error 0: Problème de connexion au serveur ou CORS');
            // Vérifier si le token est présent
            const token = this.authService.getToken();
            if (!token) {
              console.error('[DASHBOARD] PROBLEME CRITIQUE: Token JWT manquant!');
              this.error = 'Erreur d\'authentification: Veuillez vous reconnecter.';
            } else {
              this.error = 'Le serveur n\'est pas accessible. Vérifiez votre connexion ou contactez l\'administrateur.';
            }
          } else if (error.status === 403) {
            console.error('[DASHBOARD] Error 403: Accès refusé - Problème d\'autorisation');
            this.error = 'Accès refusé: Vous n\'avez pas les permissions nécessaires ou votre session a expiré.';
          } else {
            this.error = `Erreur lors du chargement des professionnels: ${error.message || 'Erreur inconnue'}`;
          }
          
          return of([]);
        }),
        finalize(() => {
          this.loading = false;
          console.log('[DASHBOARD] Fin du chargement des professionnels');
          this.lastRefreshed = new Date();
        })
      )
      .subscribe(professionals => {
        this.professionals = professionals;
        this.updateFilteredProfessionals();
        this.extractSpecialities();
        console.log(`[DASHBOARD] ${this.professionals.length} professionnels chargés avec succès`);
      });
  }

  /**
   * Extrait la liste des spécialités uniques pour le filtre
   */
  extractSpecialities(): void {
    const specialities = new Set<string>();
    this.professionals.forEach(p => {
      if (p.speciality) {
        specialities.add(p.speciality);
      }
    });
    this.availableSpecialities = Array.from(specialities).sort();
  }
  
  /**
   * Rafraîchit les données statistiques
   */
  refreshStats(): void {
    this.loading = true;
    this.loadProfessionals();
    this.showSuccessMessage('Statistiques mises à jour avec succès');
  }
  
  /**
   * Gère le changement d'onglet depuis les cartes statistiques
   */
  handleTabChange(tabName: string): void {
    // Maintenant les cartes statistiques sont uniquement dans la section statistiques
    // mais on redirige vers la section gestion pour voir la liste filtrée
    this.activeSection = 'professionals';
    this.changeTab(tabName);
    
    // Ouvrir automatiquement le sous-menu des professionnels si ce n'est pas déjà fait
    if (!this.submenuOpen['professionals']) {
      this.toggleSubmenu('professionals');
    }
  }
  
  /**
   * Ouvre/ferme un sous-menu dans la sidebar
   */
  toggleSubmenu(menuName: string): void {
    this.submenuOpen[menuName] = !this.submenuOpen[menuName];
    
    // Si on ouvre un sous-menu, fermer les autres (optionnel)
    if (this.submenuOpen[menuName]) {
      Object.keys(this.submenuOpen).forEach(key => {
        if (key !== menuName) {
          this.submenuOpen[key] = false;
        }
      });
    }
  }
  
  /**
   * Affiche un message de succès temporaire
   */
  showSuccessMessage(message: string): void {
    this.successMessage = message;
    setTimeout(() => {
      this.successMessage = null;
    }, 5000);
  }

  scheduleMessageClear(): void {
    setTimeout(() => {
      this.successMessage = null;
      this.error = null;
    }, 5000);
  }

  viewDocument(documentPath: string): void {
    if (documentPath) {
      window.open(`/api/documents/${documentPath}`, '_blank');
    }
  }

  // Mettre à jour les professionnels filtrés selon les critères actuels
  updateFilteredProfessionals(): void {
    // D'abord, filtrer par onglet sélectionné
    let filtered = this.professionals;
    if (this.currentTab !== 'all') {
      filtered = this.professionals.filter(professional => {
        switch (this.currentTab) {
          case 'pending':
            return professional.accountStatus === AccountStatus.PENDING_VERIFICATION;
          case 'active':
            return professional.accountStatus === AccountStatus.ACTIVE;
          case 'rejected':
            return professional.accountStatus === AccountStatus.REJECTED;
          case 'suspended':
            return professional.accountStatus === AccountStatus.SUSPENDED;
          case 'inactive':
            return professional.accountStatus === AccountStatus.INACTIVE;
          default:
            return true;
        }
      });
    }

    // Filtrer par spécialité si nécessaire
    if (this.specialityFilter !== 'all') {
      filtered = filtered.filter(p => p.speciality === this.specialityFilter);
    }

    // Ensuite, filtrer par recherche
    if (this.searchQuery.trim()) {
      const searchLower = this.searchQuery.trim().toLowerCase();
      filtered = filtered.filter(p =>
        p.firstName.toLowerCase().includes(searchLower) ||
        p.lastName.toLowerCase().includes(searchLower) ||
        p.email.toLowerCase().includes(searchLower) ||
        p.speciality.toLowerCase().includes(searchLower) ||
        p.registrationNumber.toLowerCase().includes(searchLower) ||
        (p.address && p.address.toLowerCase().includes(searchLower)) ||
        (p.city && p.city.toLowerCase().includes(searchLower))
      );
    }

    this.filteredProfessionals = filtered;
  }

  // Changer l'onglet actif dans la section professionnels
  changeTab(tab: string): void {
    this.currentTab = tab;
    this.updateFilteredProfessionals();
  }

  filterBySpeciality(speciality: string): void {
    this.specialityFilter = speciality;
    this.updateFilteredProfessionals();
  }

  // Méthodes pour afficher les statuts
  getStatusClass(status: AccountStatus): string {
    switch (status) {
      case AccountStatus.PENDING_VERIFICATION:
        return 'status-pending';
      case AccountStatus.ACTIVE:
        return 'status-verified';
      case AccountStatus.REJECTED:
        return 'status-rejected';
      case AccountStatus.SUSPENDED:
        return 'status-suspended';
      case AccountStatus.INACTIVE:
        return 'status-inactive';
      default:
        return '';
    }
  }

  getStatusIcon(status: AccountStatus): string {
    switch (status) {
      case AccountStatus.PENDING_VERIFICATION:
        return 'bi-hourglass-split';
      case AccountStatus.ACTIVE:
        return 'bi-check-circle';
      case AccountStatus.REJECTED:
        return 'bi-x-circle';
      case AccountStatus.SUSPENDED:
        return 'bi-pause-circle';
      case AccountStatus.INACTIVE:
        return 'bi-x-circle';
      default:
        return 'bi-question-circle';
    }
  }

  getStatusLabel(status: AccountStatus): string {
    switch (status) {
      case AccountStatus.PENDING_VERIFICATION:
        return 'En attente';
      case AccountStatus.ACTIVE:
        return 'Actif';
      case AccountStatus.REJECTED:
        return 'Rejeté';
      case AccountStatus.SUSPENDED:
        return 'Suspendu';
      case AccountStatus.INACTIVE:
        return 'Inactif';
      default:
        return 'Inconnu';
    }
  }

  // Méthode pour obtenir le nombre de professionnels en attente
  getPendingCount(): number {
    return this.professionals.filter(p => p.accountStatus === AccountStatus.PENDING_VERIFICATION).length;
  }

  // Approuver l'inscription d'un professionnel
  approveProfessional(professional: Professional): void {
    if (!professional.id) return;
    
    this.loading = true;
    this.adminService.approveProfessional(professional.id)
      .pipe(
        catchError(err => {
          this.error = `Erreur lors de l'approbation: ${err.message}`;
          return of(null);
        }),
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe(updatedProfessional => {
        if (updatedProfessional) {
          const index = this.professionals.findIndex(p => p.id === professional.id);
          if (index !== -1) {
            this.professionals[index] = updatedProfessional;
            this.updateFilteredProfessionals();
            this.successMessage = `Le professionnel ${updatedProfessional.firstName} ${updatedProfessional.lastName} a été approuvé avec succès.`;
            this.scheduleMessageClear();
          }
        }
      });
  }

  showRejectDialog(professional: Professional): void {
    this.currentProfessional = professional;
    this.reasonText = '';
    this.rejectModal.show();
  }

  confirmReject(): void {
    if (this.currentProfessional && this.reasonText) {
      this.rejectProfessional(this.currentProfessional, this.reasonText);
      this.rejectModal.hide();
    }
  }

  showReconsiderDialog(professional: Professional): void {
    this.currentProfessional = professional;
    this.confirmModal.show();
  }

  confirmReconsider(): void {
    if (this.currentProfessional) {
      this.approveProfessional(this.currentProfessional);
      this.confirmModal.hide();
    }
  }

  showSuspendDialog(professional: Professional): void {
    this.currentProfessional = professional;
    this.reasonText = '';
    this.suspendModal.show();
  }

  confirmSuspend(): void {
    if (this.currentProfessional && this.reasonText) {
      this.suspendProfessional(this.currentProfessional, this.reasonText);
      this.suspendModal.hide();
    }
  }

  // Rejeter l'inscription d'un professionnel
  rejectProfessional(professional: Professional, reason: string): void {
    if (!professional.id) return;
    
    this.loading = true;
    this.adminService.rejectProfessional(professional.id, reason)
      .pipe(
        catchError(err => {
          this.error = `Erreur lors du rejet: ${err.message}`;
          return of(null);
        }),
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe(updatedProfessional => {
        if (updatedProfessional) {
          const index = this.professionals.findIndex(p => p.id === professional.id);
          if (index !== -1) {
            this.professionals[index] = updatedProfessional;
            this.updateFilteredProfessionals();
            this.successMessage = `L'inscription de ${updatedProfessional.firstName} ${updatedProfessional.lastName} a été rejetée.`;
            this.scheduleMessageClear();
          }
        }
      });
  }

  // Suspendre un professionnel
  suspendProfessional(professional: Professional, reason: string): void {
    if (!professional.id) return;
    
    this.loading = true;
    this.adminService.suspendProfessional(professional.id, reason)
      .pipe(
        catchError(err => {
          this.error = `Erreur lors de la suspension: ${err.message}`;
          return of(null);
        }),
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe(updatedProfessional => {
        if (updatedProfessional) {
          const index = this.professionals.findIndex(p => p.id === professional.id);
          if (index !== -1) {
            this.professionals[index] = updatedProfessional;
            this.updateFilteredProfessionals();
            this.successMessage = `Le compte de ${updatedProfessional.firstName} ${updatedProfessional.lastName} a été suspendu.`;
            this.scheduleMessageClear();
          }
        }
      });
  }

  archiveProfessional(professional: Professional): void {
    this.currentProfessional = professional;
    // Configurer un écouteur d'événement pour confirmer l'archivage
    const confirmButtonEl = document.getElementById('confirmArchiveButton');
    if (confirmButtonEl) {
      confirmButtonEl.onclick = () => {
        if (this.currentProfessional && this.currentProfessional.id) {
          this.loading = true;
          this.adminService.archiveProfessional(this.currentProfessional.id)
            .pipe(
              catchError(err => {
                this.error = `Erreur lors de l'archivage: ${err.message}`;
                return of(null);
              }),
              finalize(() => {
                this.loading = false;
              })
            )
            .subscribe(success => {
              if (success) {
                // Supprimer de la liste locale
                this.professionals = this.professionals.filter(p => p.id !== this.currentProfessional?.id);
                this.updateFilteredProfessionals();
                this.successMessage = `Le compte de ${this.currentProfessional?.firstName} ${this.currentProfessional?.lastName} a été archivé définitivement.`;
                this.scheduleMessageClear();
              }
              this.confirmModal.hide();
            });
        }
      };
    }
    // Afficher la modal de confirmation
    this.confirmModal.show();
  }

  viewProfessionalDetails(professional: Professional): void {
    // Définir le professionnel actuel pour afficher la modale
    // La propriété [show]="!!currentProfessional" du composant app-professional-details-modal
    // permettra d'afficher automatiquement la modale
    this.currentProfessional = professional;
    console.log('Professional details requested for:', professional.firstName, professional.lastName);
  }

  // Se déconnecter
  logout(): void {
    this.authService.logout();
    window.location.href = '/auth/login';
  }
  
  /**
   * Vérifie la taille de l'écran et ajuste l'état de la sidebar en conséquence
   */
  checkScreenSize(): void {
    this.isMobile = window.innerWidth < 992;
    if (this.isMobile && !this.sidebarCollapsed) {
      this.sidebarCollapsed = true;
    }
  }

  /**
   * Bascule l'état de la sidebar entre déplié et replié
   */
  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
    console.log('[ADMIN-DASHBOARD] Sidebar toggled:', this.sidebarCollapsed ? 'collapsed' : 'expanded');
  }
  
  setActiveSection(section: string) {
    this.activeSection = section;
  }
}
