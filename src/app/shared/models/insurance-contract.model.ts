import { Patient } from './patient.model';
import { Insurance } from './insurance.model';

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

export interface Coverage {
  id: number;
  coverageType: string;
  coverageRate: number;
  coverageCeiling: number;
  contract: {
    id: number;
  };
}
