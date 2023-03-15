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
