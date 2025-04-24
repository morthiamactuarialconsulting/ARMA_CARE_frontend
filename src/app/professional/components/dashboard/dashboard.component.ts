import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
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

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    // Ici, nous devrons implémenter un service pour récupérer les détails du professionnel
    // Pour l'instant, nous utilisons seulement les informations de base de l'utilisateur connecté
    this.loading = false;
    this.professional = {
      firstName: 'Utilisateur',
      lastName: 'Professionnel',
      speciality: 'Médecine générale',
      accountStatus: 'VERIFIED'
    };
  }

  logout(): void {
    this.authService.logout();
    window.location.href = '/auth/login';
  }
}
