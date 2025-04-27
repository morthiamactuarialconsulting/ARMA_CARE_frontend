import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-professionals',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './professionals.component.html',
  styleUrl: './professionals.component.scss'
})
export class ProfessionalsComponent implements OnInit {
  specialties: string[] = [
    'Médecins généralistes',
    'Médecins spécialistes',
    'Dentistes',
    'Kinésithérapeutes',
    'Infirmiers',
    'Pharmaciens',
    'Laboratoires',
    'Radiologues',
    'Et plus...'
  ];
  
  benefits = [
    {
      icon: 'hourglass-split',
      title: 'Gain de temps',
      description: 'Réduction de 70% du temps consacré à la gestion administrative'
    },
    {
      icon: 'currency-euro',
      title: 'Remboursements plus rapides',
      description: 'Délais réduits à 7 jours en moyenne'
    },
    {
      icon: 'graph-up',
      title: 'Tableau de bord',
      description: 'Suivi en temps réel de vos demandes'
    },
    {
      icon: 'people-fill',
      title: 'Fidélisation',
      description: 'Offrez le tiers-payant à vos patients sans contraintes'
    }
  ];

  ngOnInit(): void {
    // Animation logic can be added here if needed
  }
}
