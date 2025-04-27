import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface FaqItem {
  question: string;
  answer: string;
  isOpen?: boolean;
}

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './faq.component.html',
  styleUrl: './faq.component.scss'
})
export class FaqComponent implements OnInit {
  faqItems: FaqItem[] = [];

  ngOnInit(): void {
    this.loadFaqItems();
  }
  
  toggleFaq(index: number): void {
    // Fermer tous les autres éléments
    this.faqItems.forEach((item, i) => {
      if (i !== index) {
        item.isOpen = false;
      }
    });
    
    // Basculer l'état de l'élément cliqué
    this.faqItems[index].isOpen = !this.faqItems[index].isOpen;
  }

  loadFaqItems(): void {
    this.faqItems = [
      {
        question: 'Comment fonctionne le système de tiers-payant ?',
        answer: 'Le système de tiers-payant permet aux patients de ne pas avancer les frais médicaux. ARMA-CARE facilite la gestion de ce processus en automatisant les demandes de remboursement entre les professionnels de santé et les assurances.',
        isOpen: false
      },
      {
        question: 'Combien de temps faut-il pour recevoir un remboursement ?',
        answer: 'Avec ARMA-CARE, les délais de remboursement sont considérablement réduits. En moyenne, les professionnels reçoivent leurs paiements en 7 jours, contre 30 jours ou plus avec les systèmes traditionnels.',
        isOpen: false
      },
      {
        question: 'Quelles spécialités médicales peuvent utiliser ARMA-CARE ?',
        answer: 'ARMA-CARE est adapté à toutes les spécialités médicales : médecins généralistes, dentistes, kinésithérapeutes, infirmiers, orthophonistes, et bien d\'autres. La plateforme s\'adapte aux besoins spécifiques de chaque profession.',
        isOpen: false
      },
      {
        question: 'Comment puis-je m\'inscrire en tant que professionnel de santé ?',
        answer: 'L\'inscription est simple et rapide. Cliquez sur "S\'inscrire" en haut de la page, complétez le formulaire avec vos informations professionnelles et téléchargez les documents requis (CNI, diplôme, licence professionnelle). Votre compte sera activé après vérification.',
        isOpen: false
      },
      {
        question: 'ARMA-CARE est-il conforme au RGPD ?',
        answer: 'Absolument. La sécurité et la confidentialité des données sont nos priorités. ARMA-CARE est entièrement conforme au Règlement Général sur la Protection des Données (RGPD) et utilise des technologies de pointe pour protéger vos informations.',
        isOpen: false
      }
    ];
  }
}
