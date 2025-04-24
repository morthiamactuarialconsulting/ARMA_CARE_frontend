import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../shared/services/auth.service';
import { FileService } from '../../../shared/services/file.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  isSubmitting = false;
  errorMessage = '';
  submitted = false;
  selectedFiles: { [key: string]: File } = {};
  fileNames: { [key: string]: string } = {};

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private fileService: FileService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      speciality: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      address: ['', [Validators.required]],
      city: ['', [Validators.required]],
      registrationNumber: ['', [Validators.required]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  // Validation personnalisée pour vérifier que les mots de passe correspondent
  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  // Gestion de la sélection des fichiers
  onFileSelected(event: Event, fileType: string) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      const file = target.files[0];
      this.selectedFiles[fileType] = file;
      this.fileNames[fileType] = file.name;
    }
  }

  // Soumission du formulaire
  onSubmit() {
    this.submitted = true;

    // Arrêter ici si le formulaire est invalide
    if (this.registerForm.invalid) {
      return;
    }

    // Vérifier que tous les fichiers requis sont sélectionnés
    if (!this.selectedFiles['identityDocument'] || 
        !this.selectedFiles['diploma'] || 
        !this.selectedFiles['license'] ||
        !this.selectedFiles['bankAccountNumber'] || 
        !this.selectedFiles['professionalInsurance']) {
      this.errorMessage = 'Veuillez télécharger tous les documents requis.';
      return;
    }

    this.isSubmitting = true;
    
    // Préparer les données pour l'API
    const professionalData = {
      ...this.registerForm.value,
      // Omettre confirmPassword car le backend n'en a pas besoin
      confirmPassword: undefined
    };
    
    // Créer un FormData avec les données du formulaire et les fichiers
    const formData = this.fileService.prepareRegistrationFormData(
      professionalData, 
      this.selectedFiles
    );
    
    // Appeler le service d'auth pour l'inscription avec fichiers
    this.authService.registerWithFiles(formData).subscribe({
      next: (response) => {
        // Navigation vers la page de succès
        this.router.navigate(['/auth/register-success']);
      },
      error: (error) => {
        this.isSubmitting = false;
        this.errorMessage = error.error?.message || 
                            'Une erreur est survenue lors de l\'inscription. Veuillez réessayer.';
      },
      complete: () => {
        this.isSubmitting = false;
      }
    });
  }
}
