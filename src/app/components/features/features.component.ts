import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Feature {
  icon: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-features',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './features.component.html',
  styleUrl: './features.component.scss'
})
export class FeaturesComponent implements OnInit {
  features: Feature[] = [];

  ngOnInit(): void {
    this.loadFeatures();
  }

  loadFeatures(): void {
    this.features = [
      {
        icon: 'wallet',
        title: 'Tiers-payant simplifié',
        description: 'Automatisez vos demandes de remboursement et suivez leur progression en temps réel.'
      },
      {
        icon: 'dashboard',
        title: 'Tableau de bord',
        description: 'Visualisez l\'ensemble de vos demandes et recevez des alertes sur leur statut.'
      },
      {
        icon: 'document',
        title: 'Gestion documentaire',
        description: 'Stockez et organisez tous vos documents de manière sécurisée et accessible.'
      },
      {
        icon: 'user-shield',
        title: 'Sécurité des données',
        description: 'Protection des données conforme au RGPD et aux standards de sécurité les plus stricts.'
      }
    ];
  }
}
