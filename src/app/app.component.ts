import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/shared/navbar/navbar.component';
import { FooterComponent } from './components/shared/footer/footer.component';
import * as AOS from 'aos';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'arma-care-frontend';
  
  ngOnInit() {
    // Initialisation de AOS (Animate On Scroll)
    AOS.init({
      duration: 800,     // durée de l'animation en ms
      easing: 'ease-out-cubic',   // type d'easing
      once: false,       // l'animation se joue à chaque défilement
      offset: 50,        // décalage (en px) par rapport au point de déclenchement
      delay: 0,          // délai avant l'animation
      anchorPlacement: 'top-bottom', // définit quelle position de l'élément par rapport à la fenêtre doit déclencher l'animation
    });
  }
}
