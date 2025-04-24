import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  // Formulaire de contact
  contactForm!: FormGroup;
  isSubmitting = false;
  currentYear: number = new Date().getFullYear();

  // Fonctionnalités mises en avant sur la page d'accueil
  features = [
    {
      title: 'Consultation Médicale',
      description: 'Consultez des professionnels de santé qualifiés depuis le confort de votre domicile',
      icon: 'medical-bag'
    },
    {
      title: 'Dossier Médical Digital',
      description: 'Accédez à votre dossier médical complet et partagez-le avec vos médecins',
      icon: 'folder-medical'
    },
    {
      title: 'Pharmacie en ligne',
      description: 'Commandez vos médicaments et recevez-les directement chez vous',
      icon: 'pills'
    },
    {
      title: 'Suivi de Santé',
      description: 'Suivez vos paramètres de santé et recevez des recommandations personnalisées',
      icon: 'chart-line'
    }
  ];

  // Avantages du tiers-payant
  tiersBenefits = [
    {
      title: 'Pour les patients',
      items: ['Pas d\'avance de frais', 'Accès facilité aux soins', 'Démarches simplifiées'],
      icon: 'user'
    },
    {
      title: 'Pour les professionnels',
      items: ['Fidélisation des patients', 'Paiements garantis', 'Moins de gestion administrative'],
      icon: 'user-md'
    },
    {
      title: 'Pour les assurances',
      items: ['Contrôle des remboursements', 'Données analytiques', 'Relations facilitées avec les professionnels'],
      icon: 'building'
    }
  ];

  // Témoignages
  testimonials = [
    {
      name: 'Dr. Fatou Ndiaye',
      role: 'Cardiologue',
      comment: 'ARMA-CARE me permet de suivre mes patients à distance, ce qui est particulièrement utile pour les zones rurales.',
      avatar: 'assets/img/testimonials/doctor1.jpg'
    },
    {
      name: 'Abdoulaye Diop',
      role: 'Patient',
      comment: 'Grâce à ARMA-CARE, j\'ai pu consulter un spécialiste sans avoir à me déplacer à Dakar. Un vrai gain de temps!',
      avatar: 'assets/img/testimonials/patient1.jpg'
    },
    {
      name: 'Aminata Sow',
      role: 'Pharmacienne',
      comment: 'La plateforme facilite la gestion des ordonnances et la livraison des médicaments aux patients.',
      avatar: 'assets/img/testimonials/pharmacist1.jpg'
    }
  ];

  // FAQ
  faqItems = [
    {
      question: 'Qu\'est-ce que ARMA CARE ?',
      answer: 'ARMA CARE est une plateforme qui simplifie la gestion du tiers-payant entre les professionnels de santé et les assurances. Notre solution permet d\'automatiser les demandes de remboursement, de suivre leur progression et d\'accélérer les paiements.'
    },
    {
      question: 'Comment fonctionne le service ?',
      answer: 'Les professionnels de santé s\'inscrivent sur notre plateforme et peuvent immédiatement commencer à envoyer des demandes de remboursement aux assurances partenaires. Notre système vérifie automatiquement les informations, traite les demandes et suit les paiements.'
    },
    {
      question: 'Quels sont les délais de remboursement ?',
      answer: 'Grâce à notre système automatisé, les délais de remboursement sont considérablement réduits. En moyenne, les professionnels sont remboursés sous 7 jours, contre 2 à 3 semaines avec les méthodes traditionnelles.'
    }
  ];

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.initContactForm();
    this.initAccordions();
  }

  initContactForm(): void {
    this.contactForm = this.formBuilder.group({
      companyName: ['', Validators.required],
      contactName: ['', Validators.required],
      position: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      message: ['', Validators.required],
      gdpr: [false, Validators.requiredTrue]
    });
  }

  onSubmit(): void {
    if (this.contactForm.invalid) {
      return;
    }

    this.isSubmitting = true;

    // Simuler un envoi de formulaire
    setTimeout(() => {
      console.log('Formulaire soumis:', this.contactForm.value);
      this.contactForm.reset();
      this.isSubmitting = false;
      alert('Votre demande a été envoyée avec succès ! Nous vous contacterons sous 48h.');
    }, 1500);
  }

  initAccordions(): void {
    setTimeout(() => {
      const accordionHeaders = document.querySelectorAll('.accordion-header');
      accordionHeaders.forEach((header) => {
        header.addEventListener('click', () => {
          const accordionItem = header.parentElement;
          accordionItem?.classList.toggle('active');
        });
      });
    }, 500);
  }
}
