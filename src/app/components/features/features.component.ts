import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Feature {
  icon: string;
  title: string;
  description: string;
  primary?: boolean;
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
        icon: 'heart-pulse',
        title: 'Gestion du tiers-payant',
        description: 'Solution complète pour automatiser vos demandes de remboursement et suivre leur progression en temps réel.',
        primary: false
      },
      {
        icon: 'clipboard2-data',
        title: 'Tableau de bord intelligent',
        description: 'Visualisez l\'ensemble de vos dossiers, analysez vos performances et identifiez les opportunités d\'optimisation.',
        primary: true
      },
      {
        icon: 'file-earmark-text',
        title: 'Gestion documentaire',
        description: 'Stockez, organisez et partagez tous vos documents médicaux et administratifs de manière sécurisée.',
        primary: false
      },
      {
        icon: 'hourglass-split',
        title: 'Suivi des délais',
        description: 'Anticipez les retards de paiement et gérez efficacement vos relances grâce à nos alertes personnalisées.',
        primary: false
      },
      {
        icon: 'shield-check',
        title: 'Sécurité renforcée',
        description: 'Protection des données conforme au RGPD et aux standards de sécurité les plus stricts du secteur médical.',
        primary: false
      },
      {
        icon: 'headset',
        title: 'Assistance dédiée',
        description: 'Bénéficiez d\'un accompagnement personnalisé par nos experts du tiers-payant pour optimiser votre pratique.',
        primary: false
      }
    ];
  }
}
