import { InvestigationModel, InvestigationRequestModel } from './investigation';
import { ProcedureModel, ProcedureRequestModel } from './procedure';
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
    procedures: ProcedureRequestModel[];
    investigations: InvestigationRequestModel[];
    start_date: string;
    end_date: string;
  };
  claim: {
    id: string;
    diagnoses: DiagnosisModel[];
    invoices: InvoiceModel[];
    procedures: ProcedureModel[];
    investigations: InvestigationModel[];
    notes: string;
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
