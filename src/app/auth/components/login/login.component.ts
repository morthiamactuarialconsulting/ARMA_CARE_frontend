import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  returnUrl: string = '/';
  isSubmitting = false;
  error = '';
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    // Rediriger vers le tableau de bord si déjà connecté
    if (this.authService.isLoggedIn()) {
      this.navigateBasedOnRole();
      return;
    }

    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.email]],  // L'email est utilisé comme identifiant
      password: ['', Validators.required]
    });

    // Récupérer l'URL de retour des paramètres de route ou utiliser la page d'accueil
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  // Méthode pour naviguer selon le rôle de l'utilisateur
  private navigateBasedOnRole(): void {
    if (this.authService.hasRole('ROLE_ADMIN')) {
      this.router.navigate(['/admin/dashboard']);
    } else if (this.authService.hasRole('ROLE_PROFESSIONAL')) {
      this.router.navigate(['/professional/dashboard']);
    } else {
      this.router.navigate(['/']);
    }
  }

  // Gestionnaire de soumission du formulaire
  onSubmit(): void {
    this.submitted = true;

    // Arrêter ici si le formulaire est invalide
    if (this.loginForm.invalid) {
      // Afficher un message d'erreur spécifique pour l'email invalide
      if (this.loginForm.get('username')?.errors?.['email']) {
        this.error = "Veuillez entrer une adresse email valide";
      }
      return;
    }

    this.isSubmitting = true;
    this.error = '';

    this.authService.login(this.loginForm.value)
      .subscribe({
        next: () => {
          this.navigateBasedOnRole();
        },
        error: error => {
          this.error = error.error?.message || 'Nom d\'utilisateur ou mot de passe incorrect';
          this.isSubmitting = false;
        },
        complete: () => {
          this.isSubmitting = false;
        }
      });
  }
}
