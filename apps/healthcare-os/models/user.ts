import { FacilityModel } from './facility';

export interface UserModel {
  id: string;
  photo: string;
  name: string;
  first_name: string;
  last_name: string;
  dob: string;
  gender: string;
  email: string;
  email_verified_at: string;
  phone: string;
  phone_verified_at: string;
  address: string;
  created_at: string;
  active: boolean;
  facilities: FacilityModel[];
}
