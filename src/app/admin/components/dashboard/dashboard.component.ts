import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../shared/services/auth.service';
import { Professional, AccountStatus } from '../../../shared/models/professional.model';


@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  professionals: Professional[] = [];
  loading = true;
  error = '';
  selectedTab = 'pending';
  AccountStatus = AccountStatus; // Exposer l'énumération au template
  
  // Pour l'exemple, nous utilisons des données statiques
  // Dans une vraie implémentation, ces données viendraient du backend
  mockProfessionals: Professional[] = [
    {
      id: 1,
      firstName: 'Jean',
      lastName: 'Dupont',
      speciality: 'Cardiologie',
      phone: '+221 77 123 45 67',
      email: 'jean.dupont@example.com',
      address: 'Avenue Cheikh Anta Diop',
      city: 'Dakar',
      country: 'Sénégal',
      registrationNumber: 'SN-CARD-001',
      identityDocumentPath: 'identity/1/identity.pdf',
      diplomaPath: 'diploma/1/diploma.pdf',
      licensePath: 'license/1/license.pdf',
      accountStatus: AccountStatus.PENDING_VERIFICATION,
      statusChangeDate: new Date('2025-04-20')
    },
    {
      id: 2,
      firstName: 'Marie',
      lastName: 'Diallo',
      speciality: 'Pédiatrie',
      phone: '+221 77 987 65 43',
      email: 'marie.diallo@example.com',
      address: 'Rue Félix Faure',
      city: 'Saint-Louis',
      country: 'Sénégal',
      registrationNumber: 'SN-PED-002',
      identityDocumentPath: 'identity/2/identity.pdf',
      diplomaPath: 'diploma/2/diploma.pdf',
      licensePath: 'license/2/license.pdf',
      accountStatus: AccountStatus.VERIFIED,
      statusChangeDate: new Date('2025-04-15')
    },
    {
      id: 3,
      firstName: 'Amadou',
      lastName: 'Sow',
      speciality: 'Ophtalmologie',
      country: 'Sénégal',
      phone: '+221 78 123 45 67',
      email: 'amadou.sow@example.com',
      address: 'Avenue de la République',
      city: 'Thiès',
      registrationNumber: 'SN-OPHT-003',
      identityDocumentPath: 'identity/3/identity.pdf',
      diplomaPath: 'diploma/3/diploma.pdf',
      licensePath: 'license/3/license.pdf',
      accountStatus: AccountStatus.REJECTED,
      statusChangeReason: 'Document d\'identité illisible',
      statusChangeDate: new Date('2025-04-18')
    }
  ];

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    // Simuler un chargement depuis l'API
    setTimeout(() => {
      this.professionals = this.mockProfessionals;
      this.loading = false;
    }, 1000);
  }

  // Filtrer les professionnels selon l'onglet sélectionné
  get filteredProfessionals(): Professional[] {
    switch (this.selectedTab) {
      case 'pending':
        return this.professionals.filter(p => p.accountStatus === AccountStatus.PENDING_VERIFICATION);
      case 'verified':
        return this.professionals.filter(p => p.accountStatus === AccountStatus.VERIFIED);
      case 'rejected':
        return this.professionals.filter(p => p.accountStatus === AccountStatus.REJECTED);
      case 'all':
        return this.professionals;
      default:
        return this.professionals;
    }
  }

  // Changer l'onglet actif
  changeTab(tab: string): void {
    this.selectedTab = tab;
  }

  // Approuver l'inscription d'un professionnel
  approveProfessional(professional: Professional): void {
    // Dans une vraie implémentation, ceci appellerait une API backend
    professional.accountStatus = AccountStatus.VERIFIED;
    professional.statusChangeDate = new Date();
    professional.statusChangeReason = '';
    // Ajouter un message de succès ou notification
  }

  // Rejeter l'inscription d'un professionnel
  rejectProfessional(professional: Professional, reason: string): void {
    // Dans une vraie implémentation, ceci appellerait une API backend
    professional.accountStatus = AccountStatus.REJECTED;
    professional.statusChangeDate = new Date();
    professional.statusChangeReason = reason;
    // Ajouter un message de succès ou notification
  }

  // Suspendre le compte d'un professionnel
  suspendProfessional(professional: Professional, reason: string): void {
    // Dans une vraie implémentation, ceci appellerait une API backend
    professional.accountStatus = AccountStatus.SUSPENDED;
    professional.statusChangeDate = new Date();
    professional.statusChangeReason = reason;
    // Ajouter un message de succès ou notification
  }

  // Visualiser un document
  viewDocument(documentPath: string): void {
    // Dans une vraie implémentation, ceci ouvrirait le document dans une nouvelle fenêtre
    // ou dans une modale via un service dédié
    console.log(`Affichage du document: ${documentPath}`);
    alert(`Affichage du document: ${documentPath}`);
  }

  // Se déconnecter
  logout(): void {
    this.authService.logout();
    window.location.href = '/auth/login';
  }

  // Compter les professionnels en attente
  getPendingCount(): number {
    return this.professionals.filter(p => p.accountStatus === AccountStatus.PENDING_VERIFICATION).length;
  }
}
