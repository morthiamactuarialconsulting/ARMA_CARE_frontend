import { Professional } from './professional.model';
import { Patient } from './patient.model';
import { InsuranceContract } from './insurance-contract.model';

export enum InvoiceStatus {
  EN_ATTENTE = 'EN_ATTENTE',
  PAYEE = 'PAYEE',
  REJETEE = 'REJETEE',
  REMBOURSEE = 'REMBOURSEE',
  PARTIELLEMENT_REMBOURSEE = 'PARTIELLEMENT_REMBOURSEE'
}

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

// Classe utilitaire pour les méthodes liées aux factures
export class InvoiceUtils {
  public static getPatientShare(invoice: Invoice): number {
    return invoice.totalAmount - invoice.reimbursableAmount;
  }
}
