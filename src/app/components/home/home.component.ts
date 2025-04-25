import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// Importation des composants individuels
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { HeroComponent } from '../hero/hero.component';
import { AboutComponent } from '../about/about.component';
import { FeaturesComponent } from '../features/features.component';
import { TiersPayantComponent } from '../tiers-payant/tiers-payant.component';
import { TestimonialsComponent } from '../testimonials/testimonials.component';
import { ContactComponent } from '../contact/contact.component';
import { ProfessionalsComponent } from '../professionals/professionals.component';
import { FaqComponent } from '../faq/faq.component';
import { CtaComponent } from '../cta/cta.component';
import { FooterComponent } from '../shared/footer/footer.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule,
    NavbarComponent,
    HeroComponent,
    AboutComponent,
    FeaturesComponent,
    TiersPayantComponent,
    TestimonialsComponent,
    ContactComponent,
    ProfessionalsComponent,
    FaqComponent,
    CtaComponent,
    FooterComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  currentYear: number = new Date().getFullYear();

  constructor() {}

  ngOnInit(): void {
    // Aucune initialisation nécessaire maintenant que les fonctionnalités
    // ont été déplacées vers des composants individuels
  }
}
