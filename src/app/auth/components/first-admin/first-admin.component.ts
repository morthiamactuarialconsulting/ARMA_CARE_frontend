import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../shared/services/auth.service';
import { AdminRegisterRequest } from '../../../shared/models/auth.model';

@Component({
  selector: 'app-first-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './first-admin.component.html',
  styleUrls: ['./first-admin.component.scss']
})
export class FirstAdminComponent implements OnInit {
  adminForm: FormGroup;
  loading = false;
  error = '';
  adminExists = false;
  submitted = false;
  redirectTimer: any;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.adminForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  ngOnInit(): void {
    this.checkAdminExists();
  }

  // Vérifie si un administrateur existe déjà dans le système
  checkAdminExists(): void {
    this.loading = true;
    this.authService.checkAdminExists().subscribe({
      next: (response) => {
        this.adminExists = response.adminExists;
        this.loading = false;
        
        // Si un administrateur existe déjà, rediriger vers la page de connexion
        if (this.adminExists) {
          this.error = 'Un administrateur existe déjà dans le système. Redirection vers la page de connexion...';
          this.redirectTimer = setTimeout(() => {
            this.router.navigate(['/auth/login']);
          }, 3000);
        }
      },
      error: (err) => {
        this.error = 'Erreur lors de la vérification des administrateurs. Veuillez réessayer.';
        this.loading = false;
      }
    });
  }

  // Crée le premier administrateur
  onSubmit(): void {
    this.submitted = true;
    
    // Stopper si le formulaire est invalide
    if (this.adminForm.invalid) {
      return;
    }
    
    this.loading = true;
    this.error = '';
    
    const adminData: AdminRegisterRequest = {
      email: this.adminForm.value.email,
      firstName: this.adminForm.value.firstName,
      lastName: this.adminForm.value.lastName,
      password: this.adminForm.value.password,
      confirmPassword: this.adminForm.value.confirmPassword
    };
    
    this.authService.registerFirstAdmin(adminData).subscribe({
      next: (response) => {
        console.log('Administrateur créé avec succès', response);
        this.loading = false;
        // Rediriger vers le dashboard administrateur
        this.router.navigate(['/admin/dashboard']);
      },
      error: (err) => {
        console.error('Erreur lors de la création de l\'administrateur', err);
        this.error = err.error?.message || 'Erreur lors de la création de l\'administrateur. Veuillez réessayer.';
        this.loading = false;
      }
    });
  }

  // Validator pour vérifier que les mots de passe correspondent
  passwordMatchValidator(g: FormGroup) {
    const password = g.get('password')?.value;
    const confirmPassword = g.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { 'mismatch': true };
  }

  // Getters pour simplifier l'accès aux champs du formulaire
  get f() { return this.adminForm.controls; }
  
  ngOnDestroy(): void {
    // Nettoyer le timer à la destruction du composant
    if (this.redirectTimer) {
      clearTimeout(this.redirectTimer);
    }
  }
}
