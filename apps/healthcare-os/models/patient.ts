import { CountryModel, DistrictModel, RegionModel } from './geolocation';
import { InstitutionModel } from './institution';
import { InsuranceModel } from './insurance';
import { TriageModel } from './triage';

export interface PatientModel {
  id: string;
  photo: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  name: string;
  dob: string;
  gender: string;
  ghanacard?: string;
  email?: string;
  phone?: string;
  phone_type?: string;
  country: CountryModel;
  region: RegionModel;
  district: DistrictModel;
  folder_number: string;
  institution: InstitutionModel;
  city: string;
  address: string;
  status: 'visiting' | 'detained' | 'admitted';
  next_of_kin_name: string;
  next_of_kin_phone?: string;
  nationality: {
    id: string;
    code: string;
    name: string;
  };

  language: string;
  marital_status: string;
  active: boolean;
  insurances: InsuranceModel[];
  triage: TriageModel;
  queue: {
    id: string;
    name: string;
  };
}
