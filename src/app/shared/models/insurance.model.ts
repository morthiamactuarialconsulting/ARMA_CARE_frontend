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
