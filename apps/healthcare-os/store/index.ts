import { v4 } from 'uuid';
import { PatientModel } from '../models';

const store: { patients: Partial<PatientModel>[] } = {
  patients: [
    {
      id: v4(),
      is_inpatient: false,
      in_visitation: false,
      first_name: 'Kwabena',
      last_name: 'Boamah',
      date_of_birth: '1990-11-22',
      sex: 'Male',
      address: {
        region: 'Greater Accra',
        district: 'Achimota',
        city: 'Achimota',
        street: 'Treet',
      },
      language: 'English',
      marital_status: 'single',
      phone: '0501384208',

      insurance: {
        insurance_type: 'nhis',
        is_valid: true,

        nhis_membership_status: 'member',
        nhis_membership_number: '12345678',
        nhis_expiry_date: '2030-05-13',
        nhis_claim_code: '123455',
      },
    },
    {
      id: v4(),
      is_inpatient: true,
      in_visitation: true,
      first_name: 'Lawrence',
      middle_name: 'Kweku',
      last_name: 'Adu',
      date_of_birth: '1995-11-22',
      sex: 'Male',
      address: {
        region: 'Greater Accra',
        district: 'Achimota',
        city: 'Achimota',
        street: 'Treet',
      },
      language: 'English',
      marital_status: 'single',
      phone: '0249817978',
      id_number: 'GHA-712500441-6',

      insurance: {
        insurance_type: 'private',
        is_valid: true,

        private_scheme_name: 'Nationwide Health',
        private_membership_number: '12345678',
        private_expiry_date: '2030-05-13',
        private_cover_valid: true,
      },
    },
  ],
};

export default store;
