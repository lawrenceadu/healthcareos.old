import { InvestigationRequestModel } from './investigation';

export interface HistoryModel {
  id: string;
  start_date: string;
  end_date: string;
  logs: HistoryLog[];
}

export interface HistoryLog {
  id: string;
  description: string;
  reference:
    | 'location'
    | 'vital'
    | 'consultation'
    | 'allergy'
    | 'queue'
    | 'investigation';
  details: any;
  created_at: string;
  created_by: {
    id: string;
    name: string;
  };
}

export interface LocationHistoryModel {
  id: string;
  name: string;
  type: string;
}

export interface QueueHistoryModel {
  id: string;
  name: string;
  location: {
    id: string;
    name: string;
  };
}

export interface VitalHistoryModel {
  id: string;
  respiratory_rate: string;
  oxygen_saturations: string;
  fraction_of_inspired_oxygen: string;
  heart_rate: string;
  systolic: string;
  diastolic: string;
  temperature: string;
  height: string;
  weight: string;
  bmi: string;
  body_surface_area: string;
  notes: string;
}

export interface ConsultationHistoryModel {
  id: string;
  plan: string;
  history_examination: string;
  diagnoses: { id: string; name: string }[];
}

// eslint-disable-next-line
export interface InvestigationHistoryModel extends InvestigationRequestModel {}
