import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface TiersBenefit {
  icon: string;
  title: string;
  items: string[];
}

@Component({
  selector: 'app-tiers-payant',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tiers-payant.component.html',
  styleUrl: './tiers-payant.component.scss'
})
export class TiersPayantComponent implements OnInit {
  tiersBenefits: TiersBenefit[] = [];

  ngOnInit(): void {
    this.loadBenefits();
  }

  loadBenefits(): void {
    this.tiersBenefits = [
      {
        icon: 'person-fill',
        title: 'Pour les patients',
        items: [
          'Pas d\'avance de frais',
          'Accès aux soins facilité',
          'Suivi simplifie des remboursements',
          'Réduction du stress financier'
        ]
      },
      {
        icon: 'heart-pulse-fill',
        title: 'Pour les professionnels',
        items: [
          'Réduction des tâches administratives',
          'Paiements plus rapides',
          'Réduction des impayés',
          'Fidélisation de la clientèle'
        ]
      },
      {
        icon: 'shield-fill-check',
        title: 'Pour les assurances',
        items: [
          'Contrôle accru des demandes',
          'Réduction des fraudes',
          'Procédés automatisés',
          'Satisfaction client améliorée'
        ]
      }
    ];
  }
}
