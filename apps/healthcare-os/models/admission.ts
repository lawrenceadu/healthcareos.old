import { DiagnosisModel } from './diagnosis';
import { PatientModel } from './patient';

export interface AdmissionModel {
  id: string;
  bed: string;
  diagnoses: DiagnosisModel[];
  patient: PatientModel;
  start_date: string;
}
