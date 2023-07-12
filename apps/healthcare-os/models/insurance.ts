import { DiagnosisModel } from './diagnosis';
import { InvoiceModel } from './invoice';
import { PatientModel } from './patient';
import { UserModel } from './user';

export interface InsuranceModel {
  id: string;
  type: string;
  scheme_name: string;
  membership_status: string;
  membership_number: string;
  expiry_date: string;
  claim_code: string;
  active: number;
  created_at: Date;
  updated_at: Date;
}

export interface InsuranceClaimModel {
  insurance: InsuranceModel;
  patient: PatientModel;
  status: string;
  total: string;
  visit: {
    id: string;
    created_by: UserModel;
    patient: PatientModel;
    invoices: InvoiceModel[];
    diagnoses: DiagnosisModel[];
    start_date: string;
    end_date: string;
  };
  claim: {
    id: string;
    diagnoses: DiagnosisModel[];
    notes: string;
    invoices: InvoiceModel[];
    patient: PatientModel;
    history: {
      status: string;
      notes: string;
      id: string;
      created_by: UserModel;
      attachment: string;
      created_at: string;
    }[];
  };
}
