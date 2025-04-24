# Modèle de données frontend ARMA-CARE

Ce document sert de référence pour comprendre les différents modèles de données utilisés dans le frontend Angular d'ARMA-CARE. Il décrit les interfaces et classes principales qui représentent les entités du système.

## Système d'authentification et de sécurité

### Modèle LoginRequest

```typescript
export interface LoginRequest {
  username: string;
  password: string;
}
```

**Utilité** : Représente les données envoyées lors de la tentative de connexion d'un utilisateur.

### Modèle RegisterRequest

```typescript
export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  registrationNumber: string;
  specialization: string;
  phoneNumber: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
}
```

**Utilité** : Représente les données d'inscription d'un professionnel sans les fichiers.

### Modèle MultipartRegisterRequest

```typescript
export interface MultipartRegisterRequest {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  registrationNumber: string;
  specialization: string;
  phoneNumber: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  // Les documents sont gérés par FormData
}
```

**Utilité** : Représente les données d'inscription d'un professionnel incluant les champs du formulaire. Les fichiers (documents) sont gérés séparément via FormData.

### Modèle AuthResponse

```typescript
export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  username: string;
  roles: string[];
  expiresIn: number;
}
```

**Utilité** : Représente la réponse du serveur après une connexion ou inscription réussie, incluant les tokens d'authentification.

### Modèle UserDetails

```typescript
export interface UserDetails {
  id: number;
  username: string;
  roles: Role[];
}
```

**Utilité** : Représente les détails de l'utilisateur connecté.

### Modèle Role

```typescript
export interface Role {
  id: number;
  name: string;
}
```

**Utilité** : Représente un rôle utilisateur pour la gestion des permissions.

### Modèle PasswordChangeRequest

```typescript
export interface PasswordChangeRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
```

**Utilité** : Représente les données pour une demande de changement de mot de passe.

### Modèle PasswordResetRequest

```typescript
export interface PasswordResetRequest {
  email: string;
}
```

**Utilité** : Représente les données pour une demande de réinitialisation de mot de passe (mot de passe oublié).

### Modèle PasswordResetConfirmRequest

```typescript
export interface PasswordResetConfirmRequest {
  token: string;
  newPassword: string;
  confirmPassword: string;
}
```

**Utilité** : Représente les données pour la réinitialisation effective du mot de passe avec un token.

### Modèle PasswordResetToken

```typescript
export interface PasswordResetToken {
  id: number;
  token: string;
  user: UserDetails;
  expiryDate: Date;
}
```

**Utilité** : Représente un token de réinitialisation de mot de passe stocké dans le système.

## Professionnels de santé

### Enum AccountStatus

```typescript
export enum AccountStatus {
  PENDING_VERIFICATION = 'PENDING_VERIFICATION',
  VERIFIED = 'VERIFIED',
  REJECTED = 'REJECTED',
  SUSPENDED = 'SUSPENDED'
}
```

**Utilité** : Définit les différents états possibles pour un compte professionnel.

### Modèle Professional

```typescript
export interface Professional {
  id: number;
  firstName: string;
  lastName: string;
  speciality: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  registrationNumber: string;
  identityDocumentPath?: string;
  diplomaPath?: string;
  licensePath?: string;
  professionalInsurancePath?: string;
  accountStatus: AccountStatus;
  statusChangeReason?: string;
  statusChangeDate?: Date;
}
```

**Utilité** : Représente un professionnel de santé dans le système.

### Classe ProfessionalUtils

```typescript
export class ProfessionalUtils {
  public static getFullName(professional: Professional): string {
    return `${professional.firstName} ${professional.lastName}`;
  }

  public static isAccountUsable(professional: Professional): boolean {
    return professional.accountStatus === AccountStatus.VERIFIED;
  }
}
```

**Utilité** : Fournit des méthodes utilitaires pour travailler avec des entités Professional.

## Patients

### Modèle Patient

```typescript
export interface Patient {
  id: number;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  gender: string;
  nationalId: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  phone: string;
  email: string;
  bloodGroup?: string;
  allergies?: string;
  medicalConditions?: string;
  active: boolean;
}
```

**Utilité** : Représente un patient dans le système.

### Classe PatientUtils

```typescript
export class PatientUtils {
  public static getFullName(patient: Patient): string {
    return `${patient.firstName} ${patient.lastName}`;
  }
}
```

**Utilité** : Fournit des méthodes utilitaires pour travailler avec des entités Patient.

## Assurances

### Modèle Insurance

```typescript
export interface Insurance {
  id: number;
  name: string;
  type: string;
  email: string;
  phoneNumber: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  username: string;
  licenseNumber: string;
  contactPersonName: string;
  contactPersonPosition: string;
  contactPersonEmail: string;
  contactPersonPhone: string;
  registrationNumber: string;
  registrationDate: Date;
  armaContractNumber: string;
  armaContractStartDate: Date;
  armaContractEndDate: Date;
  registrationDocumentPath?: string;
  licensePath?: string;
  armaContractPath?: string;
  active: boolean;
}
```

**Utilité** : Représente un assureur dans le système.

## Contrats d'assurance

### Modèle InsuranceContract

```typescript
export interface InsuranceContract {
  id: number;
  contractNumber: string;
  contractType: string;
  startDate: Date;
  endDate: Date;
  deductible: number;
  active: boolean;
  patient: Patient;
  insurance: Insurance;
  coverages?: Coverage[];
}
```

**Utilité** : Représente un contrat d'assurance.

### Modèle Coverage

```typescript
export interface Coverage {
  id: number;
  coverageType: string;
  coverageRate: number;
  coverageCeiling: number;
  contract: {
    id: number;
  };
}
```

**Utilité** : Représente une couverture spécifique dans un contrat d'assurance.

## Factures

### Enum InvoiceStatus

```typescript
export enum InvoiceStatus {
  EN_ATTENTE = 'EN_ATTENTE',
  PAYEE = 'PAYEE',
  REJETEE = 'REJETEE',
  REMBOURSEE = 'REMBOURSEE',
  PARTIELLEMENT_REMBOURSEE = 'PARTIELLEMENT_REMBOURSEE'
}
```

**Utilité** : Définit les différents états possibles pour une facture.

### Modèle Invoice

```typescript
export interface Invoice {
  id: number;
  invoiceDate: Date;
  totalAmount: number;
  reimbursableAmount: number;
  status: InvoiceStatus;
  professional: Professional;
  patient: Patient;
  contract: InsuranceContract;
  invoiceDocumentPath?: string;
}
```

**Utilité** : Représente une facture dans le système.

### Classe InvoiceUtils

```typescript
export class InvoiceUtils {
  public static getPatientShare(invoice: Invoice): number {
    return invoice.totalAmount - invoice.reimbursableAmount;
  }
}
```

**Utilité** : Fournit des méthodes utilitaires pour travailler avec des entités Invoice.

---

*Ce document sera mis à jour régulièrement pour refléter les évolutions du modèle de données du frontend ARMA-CARE.*
