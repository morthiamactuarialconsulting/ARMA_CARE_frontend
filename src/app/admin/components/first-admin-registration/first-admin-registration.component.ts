import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, AdminExistsResponse } from '../../../shared/services/auth.service';
import { AdminRegisterRequest } from '../../../shared/models/auth.model';

@Component({
  selector: 'app-first-admin-registration',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './first-admin-registration.component.html',
  styleUrls: ['./first-admin-registration.component.scss']
})
export class FirstAdminRegistrationComponent implements OnInit {
  adminForm: FormGroup;
  loading = false;
  submitted = false;
  success = '';
  error = '';
  adminExists = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.adminForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(12), this.strongPasswordValidator]],
      confirmPassword: ['', Validators.required]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  ngOnInit(): void {
    // Vérifier si un administrateur existe déjà
    this.loading = true;
    this.authService.checkAdminExists().subscribe({
      next: (response: AdminExistsResponse) => {
        this.adminExists = response.adminExists;
        this.loading = false;
        
        // Si un administrateur existe déjà, rediriger vers la page de connexion
        if (this.adminExists) {
          console.log('[FIRST-ADMIN] Un administrateur existe déjà, redirection vers la connexion');
          this.router.navigate(['/auth/login']);
        }
      },
      error: (err) => {
        console.error('[FIRST-ADMIN] Erreur lors de la vérification d\'existence d\'admin:', err);
        this.error = 'Erreur lors de la vérification de l\'existence d\'un administrateur. Veuillez réessayer.';
        this.loading = false;
      }
    });
  }

  // Création du premier administrateur
  onSubmit(): void {
    this.submitted = true;
    
    // Vérifier à nouveau que le formulaire est valide
    if (this.adminForm.invalid) {
      return;
    }
    
    this.loading = true;
    this.error = '';
    this.success = '';
    
    // Vérifier à nouveau si un administrateur existe déjà (double vérification de sécurité)
    this.authService.checkAdminExists().subscribe({
      next: (response: AdminExistsResponse) => {
        if (response.adminExists) {
          this.error = 'Un administrateur existe déjà dans le système.';
          this.loading = false;
          setTimeout(() => {
            this.router.navigate(['/auth/login']);
          }, 3000);
        } else {
          // Procéder à la création du premier administrateur
          const adminData: AdminRegisterRequest = {
            email: this.adminForm.value.email,
            firstName: this.adminForm.value.firstName,
            lastName: this.adminForm.value.lastName,
            password: this.adminForm.value.password,
            confirmPassword: this.adminForm.value.confirmPassword
          };
          
          this.authService.registerFirstAdmin(adminData).subscribe({
            next: (response) => {
              console.log('[FIRST-ADMIN] Premier administrateur créé avec succès');
              this.success = 'Administrateur créé avec succès! Redirection vers le tableau de bord...';
              this.loading = false;
              
              // Enregistrer la session et rediriger vers le tableau de bord administrateur
              setTimeout(() => {
                this.router.navigate(['/admin/dashboard']);
              }, 2000);
            },
            error: (err) => {
              console.error('[FIRST-ADMIN] Erreur lors de la création du premier admin:', err);
              this.error = err.error?.message || 'Erreur lors de la création de l\'administrateur. Veuillez réessayer.';
              this.loading = false;
            }
          });
        }
      },
      error: (err) => {
        console.error('[FIRST-ADMIN] Erreur lors de la vérification d\'existence d\'admin:', err);
        this.error = 'Erreur lors de la vérification de l\'existence d\'un administrateur. Veuillez réessayer.';
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

  // Validator pour assurer un mot de passe fort
  strongPasswordValidator(control: any) {
    const value = control.value || '';
    
    // Vérification de la complexité du mot de passe
    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumeric = /[0-9]/.test(value);
    const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value);
    
    // Mot de passe doit contenir au moins 3 des 4 critères
    const passedTests = [hasUpperCase, hasLowerCase, hasNumeric, hasSpecial].filter(Boolean).length;
    
    return passedTests >= 3 ? null : { 'weakPassword': true };
  }

  // Getters pour accès rapide aux champs du formulaire
  get f() { return this.adminForm.controls; }
}
