import { DiagnosisModel } from './diagnosis';
import { PatientModel } from './patient';
import { UserModel } from './user';

export interface ProcedureModel {
  id: string;
  code: string;
  name: string;
  description: string;
  regular_price: number;
  nhis_price: number;
  private_price: number;
  active: boolean;
  created_at: string;
}

export interface ProcedureRequestModel {
  id: string;
  attachment: string;
  created_at: string;
  created_by: UserModel;
  diagnosis: DiagnosisModel;
  execution_date: string;
  notes: string;
  patient: PatientModel;
  procedure: ProcedureModel;
  report: string;
  results: any;
  status: 'completed' | 'scheduled';
  submitted_at: string;
  submitted_by: UserModel;
  users: UserModel[];
}
