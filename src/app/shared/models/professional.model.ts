export enum AccountStatus {
  PENDING_VERIFICATION = 'PENDING_VERIFICATION',
  ACTIVE = 'ACTIVE',
  REJECTED = 'REJECTED',
  SUSPENDED = 'SUSPENDED',
  INACTIVE = 'INACTIVE'
}

export interface Professional {
  id?: number;
  firstName: string;
  lastName: string;
  speciality: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  country: string;
  registrationNumber: string;
  bankAccountNumberPath?: string;
  identityDocumentPath?: string;
  diplomaPath?: string;
  licensePath?: string;
  professionalInsurancePath?: string;
  accountStatus: AccountStatus;
  statusChangeReason?: string;
  statusChangeDate?: Date;
  // Champs liés à l'authentification
  roles?: string[];
}

// Méthodes utilitaires qui peuvent être implémentées côté Angular
export class ProfessionalUtils {
  public static getFullName(professional: Professional): string {
    return `${professional.firstName} ${professional.lastName}`;
  }

  public static isAccountUsable(professional: Professional): boolean {
    return professional.accountStatus === AccountStatus.ACTIVE;
  }
}
