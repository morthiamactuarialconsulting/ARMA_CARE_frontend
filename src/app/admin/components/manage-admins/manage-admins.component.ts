import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../shared/services/auth.service';
import { AdminRegisterRequest } from '../../../shared/models/auth.model';

@Component({
  selector: 'app-manage-admins',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './manage-admins.component.html',
  styleUrls: ['./manage-admins.component.scss']
})
export class ManageAdminsComponent implements OnInit {
  adminForm: FormGroup;
  loading = false;
  submitted = false;
  success = '';
  error = '';
  showForm = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService
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
    // Initialisation
  }

  // Afficher/masquer le formulaire
  toggleForm(): void {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.resetForm();
    }
  }

  // Réinitialiser le formulaire
  resetForm(): void {
    this.adminForm.reset();
    this.submitted = false;
    this.success = '';
    this.error = '';
  }

  // Créer un nouvel administrateur
  onSubmit(): void {
    this.submitted = true;
    
    // Stopper si le formulaire est invalide
    if (this.adminForm.invalid) {
      return;
    }
    
    this.loading = true;
    this.error = '';
    this.success = '';
    
    const adminData: AdminRegisterRequest = {
      email: this.adminForm.value.email,
      firstName: this.adminForm.value.firstName,
      lastName: this.adminForm.value.lastName,
      password: this.adminForm.value.password,
      confirmPassword: this.adminForm.value.confirmPassword
    };
    
    this.authService.registerAdmin(adminData).subscribe({
      next: (response) => {
        this.success = response.message || 'Administrateur créé avec succès';
        this.loading = false;
        this.resetForm();
        this.showForm = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'Erreur lors de la création de l\'administrateur';
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
}
