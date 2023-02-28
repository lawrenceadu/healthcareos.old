export interface PatientModel {
  id: string;

  is_inpatient: boolean;
  in_visitation: boolean;
  is_admitted: boolean;

  first_name: string;
  middle_name: string;
  last_name: string;
  date_of_birth: string;
  sex: string;
  address: Partial<{
    region: string;
    district: string;
    city: string;
    street: string;
  }>;
  language: string;
  marital_status: string;
  phone: string;
  id_number: string;

  insurance: Partial<{
    insurance_type: string;
    is_valid: boolean;
    // nhis data
    nhis_membership_status: string;
    nhis_membership_number: string;
    nhis_expiry_date: string;
    nhis_claim_code: string;
    // private
    private_scheme_name: string;
    private_membership_number: string;
    private_expiry_date: string;
    private_cover_valid: boolean;
  }> | null;

  allergies: Partial<
    {
      id: string;
      substance: string;
      severity: string;
      symptons: string;
      notes: string;
    }[]
  > | null;

  severity: {
    name: string;
    color: string;
  };

  queue: Partial<{
    location: string;
    time: string;
  }> | null;
}
