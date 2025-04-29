export enum AccountStatus {
  PENDING_VERIFICATION = 'PENDING_VERIFICATION',
  VERIFIED = 'VERIFIED',
  REJECTED = 'REJECTED',
  SUSPENDED = 'SUSPENDED'
}

export interface Professional {
  id?: number;
  username?: string;
  firstName: string;
  lastName: string;
  speciality: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
  country: string;
  registrationNumber: string;
  identityDocumentPath?: string;
  diplomaPath?: string;
  licensePath?: string;
  professionalInsurancePath?: string;
  accountStatus: string | AccountStatus;
  statusChangeReason?: string;
  statusChangeDate?: Date;
  roles?: string[];
}

// Méthodes utilitaires qui peuvent être implémentées côté Angular
export class ProfessionalUtils {
  public static getFullName(professional: Professional): string {
    return `${professional.firstName} ${professional.lastName}`;
  }

  public static isAccountUsable(professional: Professional): boolean {
    return professional.accountStatus === AccountStatus.VERIFIED;
  }
}
