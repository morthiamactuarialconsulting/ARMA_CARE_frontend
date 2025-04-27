import { Component, OnInit } from '@angular/core';
import * as AOS from 'aos';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss'
})
export class HeroComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    // Initialiser AOS avec des options personnalisées
    AOS.init({
      // Paramètres globaux
      offset: 120, // décalage (en px) par rapport au point de déclenchement original
      delay: 0, // valeurs de 0 à 3000, avec pas de 50ms
      duration: 800, // valeurs de 0 à 3000, avec pas de 50ms
      easing: 'ease-in-out', // fonction d'accélération par défaut pour les animations
      once: false, // animer à chaque fois qu'on défile
      mirror: true, // les éléments doivent s'animer en sortant de la vue?
      anchorPlacement: 'top-bottom' // défini quel point de l'élément doit correspondre à quel point de la fenêtre
    });
  }

  // Rafraîchir AOS lors du changement de taille de la fenêtre
  onResize(): void {
    AOS.refresh();
  }
}
