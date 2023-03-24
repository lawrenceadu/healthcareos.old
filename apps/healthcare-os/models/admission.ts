import { DepartmentModel } from './department';
import { DiagnosisModel } from './diagnosis';
import { PatientModel } from './patient';
import { UserModel } from './user';
import { WardModel } from './ward';

export interface AdmissionModel {
  id: string;
  bed: string;
  rate: string;
  type: string;
  notes: string;
  ward: WardModel;
  outcome: string;
  end_date: string;
  start_date: string;
  created_at: string;
  patient: PatientModel;
  created_by: UserModel;
  discharge_note: string;
  discharged_by: UserModel;
  diagnoses: DiagnosisModel[];
  department: DepartmentModel;
  discharge_diagnoses: DiagnosisModel[];
}
