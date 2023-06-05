export interface FacilityModel {
  id: string;
  logo: string;
  name: string;
  tagline: string;
  email: string;
  phone: string;
  address: string;
  currency_code: string;
  currency_symbol: string;
  created_at: string;
  active: boolean;
  nhis_record_number: string;

  role: {
    id: string;
    code: string;
    name: string;
  };

  permissions: {
    id: string;
    name: string;
    access_level: string;
  }[];

  country: {
    id: string;
    code: string;
    name: string;
  };
}
