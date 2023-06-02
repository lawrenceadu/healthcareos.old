export interface InvestigationModel {
  id: string;
  code: string;
  name: string;
  description: string;
  parameters: {
    name: string;
    type: string;
    unit: string;
    required: boolean;
    options: any[];
  }[];
}

export interface InvestigationRequestModel {
  id: string;
  investigation: InvestigationModel;
  report: string;
  results: { [x: string]: string }[];
  patient: { id: string; name: string };
  notes: string;
  attachment: string;
  status: 'pending' | 'submitted';
  expected_date: string;
  submitted_by: { id: string; name: string };
  created_by: { id: string; name: string };
  submitted_at: string;
  created_at: string;
}
