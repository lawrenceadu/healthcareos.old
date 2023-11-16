import { useState } from 'react';
import { toast } from 'react-toastify';
import { Tabs } from '@healthcareos/react';

import { updatePatientService } from '../../../services/patient';
import { usePatient } from '../../../hooks';
import Onboarding from '../../../components/libs/Onboarding';
import Layout from '../../../components/libs/Layout';

export function Edit() {
  /**
   * hook
   */
  const { patient, mutate } = usePatient();

  /**
   * variables
   */
  const insurance = patient?.insurances?.[0];
  const tabs = [
    {
      name: 'Patient Details',
      slug: 'details',
      component: (props) => <Onboarding.Details {...props} params={patient} />,
    },
    {
      name: 'Contact',
      slug: 'contact',
      component: (props) => <Onboarding.Contact {...props} params={patient} />,
    },
    // {
    //   name: 'Insurance',
    //   slug: 'insurance',
    //   component: (props) => (
    //     <Onboarding.Insurance
    //       {...props}
    //       {...(insurance && {
    //         params: {
    //           has_insurance: 'yes',
    //           insurance_type: insurance.type,
    //           insurance_membership_number: insurance.membership_number,
    //           insurance_membership_status: insurance.membership_status,
    //           insurance_expiry_date: insurance.expiry_date,
    //           insurance_claim_code: insurance.claim_code,
    //           insurance_scheme_name: insurance.scheme_name,
    //         },
    //       })}
    //     />
    //   ),
    // },
    {
      name: 'Address',
      slug: 'address',
      component: (props) => (
        <Onboarding.Address
          {...props}
          params={{
            region: patient.region.id,
            district: patient.district.id,
            city: patient.city,
            address: patient.address,
          }}
        />
      ),
    },
    {
      name: 'Institution',
      slug: 'institution',
      component: (props) => (
        <Onboarding.Institution
          {...props}
          params={{ institution: patient?.institution?.id }}
        />
      ),
    },
    {
      name: 'Next of Kin',
      slug: 'kin',
      component: (props) => <Onboarding.Kin {...props} params={patient} />,
    },
    {
      name: 'Additional Information',
      slug: 'additional',
      component: (props) => (
        <Onboarding.AdditionalInfo
          {...props}
          params={{
            nationality: patient.nationality.id,
            language: patient.language,
            marital_status: patient.marital_status,
          }}
        />
      ),
    },
  ];

  /**
   * state
   */
  const [tab, setTab] = useState(tabs[0].slug);

  return (
    <Layout title="Edit patient profile" onBack>
      <Tabs
        tabs={tabs}
        activeKey={tab}
        onSelect={(key) => setTab(String(key))}
        childProps={{
          params: patient,
          button: 'Save changes',
          onSubmit: (params, { setSubmitting, setErrors }) => {
            updatePatientService(params, patient.id)
              .then((response) => {
                toast.success('Patient information updated');
                mutate();
              })
              .catch((error) => {
                if (error?.fields) {
                  setErrors(error.fields);
                }

                if (error?.message) {
                  toast.error(error.message);
                }
              })
              .finally(() => setSubmitting(false));
          },
        }}
      />
    </Layout>
  );
}

export default Edit;
