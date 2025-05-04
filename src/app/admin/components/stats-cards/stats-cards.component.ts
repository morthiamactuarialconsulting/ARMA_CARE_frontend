import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { catchError, finalize, of } from 'rxjs';
import { Professional, AccountStatus } from '../../../shared/models/professional.model';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-stats-cards',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stats-cards.component.html',
  styleUrls: ['./stats-cards.component.scss']
})
export class StatsCardsComponent implements OnInit {
  professionals: Professional[] = [];
  loading = false;
  error = '';
  
  // Propriétés pour les statistiques et tendances
  totalTrend = 5; // Augmentation fictive de 5% du nombre total
  activeTrend = 3; // Augmentation fictive de 3% des actifs
  mostCommonRejectionReason = 'Dossier incomplet';
  averageSuspensionDays = 30; // Durée moyenne des suspensions
  lastInactiveDays = 45; // Jours depuis la dernière mise à jour des inactifs
  
  // Événement pour changer d'onglet depuis les cartes statistiques
  @Output() tabChange = new EventEmitter<string>();

  // Enum accessible depuis le template
  AccountStatus = AccountStatus;

  // Getters pour les statistiques
  get totalCount(): number {
    return this.professionals.length;
  }

  get pendingCount(): number {
    return this.professionals.filter(p => p.accountStatus === AccountStatus.PENDING_VERIFICATION).length;
  }

  get activeCount(): number {
    return this.professionals.filter(p => p.accountStatus === AccountStatus.ACTIVE).length;
  }

  get rejectedCount(): number {
    return this.professionals.filter(p => p.accountStatus === AccountStatus.REJECTED).length;
  }

  get suspendedCount(): number {
    return this.professionals.filter(p => p.accountStatus === AccountStatus.SUSPENDED).length;
  }

  get inactiveCount(): number {
    return this.professionals.filter(p => p.accountStatus === AccountStatus.INACTIVE).length;
  }

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadProfessionals();
    this.calculateStatistics();
  }

  loadProfessionals(): void {
    this.loading = true;
    this.error = '';
    
    this.adminService.getAllProfessionals()
      .pipe(
        catchError(error => {
          this.error = 'Erreur lors du chargement des professionnels: ' + error.message;
          return of([]);
        }),
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe(professionals => {
        this.professionals = professionals;
        this.calculateStatistics();
      });
  }

  /**
   * Méthode pour calculer les statistiques additionnelles
   * Note: dans une implémentation réelle, ces valeurs seraient calculées à partir des données
   * actuelles plutôt que d'être des valeurs fictives
   */
  calculateStatistics(): void {
    // Dans une application réelle, cette méthode utiliserait les données effectives
    // pour calculer les tendances, moyennes, etc.
    // Ici nous utilisons des valeurs fictives à titre d'exemple
    
    if (this.professionals.length > 0) {
      // Calcul fictif des tendances basé sur une comparaison avec des données précédentes
      this.totalTrend = 5;
      this.activeTrend = this.activeCount > 0 ? 3 : -2;
      
      // Analyse des raisons de rejet (fictive)
      const rejectionReasons = [
        'Dossier incomplet', 'Diplôme non valide', 'Informations incorrectes', 'Autres'
      ];
      this.mostCommonRejectionReason = rejectionReasons[0];
      
      // Calcul de la durée moyenne des suspensions (fictif)
      this.averageSuspensionDays = 30;
      
      // Calcul du nombre de jours depuis la dernière mise à jour des inactifs (fictif)
      this.lastInactiveDays = 45;
    }
  }

  /**
   * Change l'onglet actif dans le composant parent
   */
  changeTab(tabName: string): void {
    this.tabChange.emit(tabName);
  }
}
