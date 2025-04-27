import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface Testimonial {
  name: string;
  role: string;
  comment: string;
}

@Component({
  selector: 'app-testimonials',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './testimonials.component.html',
  styleUrl: './testimonials.component.scss'
})
export class TestimonialsComponent implements OnInit {
  testimonials: Testimonial[] = [];

  ngOnInit(): void {
    this.loadTestimonials();
  }

  loadTestimonials(): void {
    this.testimonials = [
      {
        name: 'Dr. Saliou Diop',
        role: 'Médecin Cardiologue',
        comment: 'ARMA-CARE a révolutionné ma pratique quotidienne. Je ne passe plus des heures sur la paperasse administrative et mes remboursements sont effectués en moins d\'une semaine.'
      },
      {
        name: 'Dr. Aminata Touré',
        role: 'Médecin Gynécologue',
        comment: 'Grâce à ARMA-CARE, je peux proposer le tiers-payant à tous mes patients sans craindre les complications administratives ou les délais de paiement.'
      },
      {
        name: 'Mme. Sophie Touré',
        role: 'Responsable des remboursements, Assurance SantéPlus',
        comment: 'La plateforme nous permet de traiter les demandes avec une efficacité inégalée. Nos assurés et les professionnels de santé sont plus satisfaits.'
      }
    ];
  }
}
