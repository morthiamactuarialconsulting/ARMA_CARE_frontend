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

// Classe utilitaire pour les méthodes liées aux patients
export class PatientUtils {
  public static getFullName(patient: Patient): string {
    return `${patient.firstName} ${patient.lastName}`;
  }
}
