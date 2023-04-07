import { AddIcon, ShieldPlusIcon } from '@healthcare/icons';
import { Button } from '@healthcareos/react';
import { toast } from 'react-toastify';

import { updatePatientService } from '../../../services/patient';
import { usePatient } from '../../../hooks';
import Onboarding from '../Onboarding';
import AddForm from './Insurance/Add';

export function Insurance() {
  /**
   * hook
   */
  const { patient, mutate } = usePatient();

  /**
   * variables
   */
  const insurance = patient.insurances?.[0];

  return (
    <div>
      {insurance && (
        <div className="max-w-[424px]">
          <Onboarding.Insurance
            header={false}
            button="Save changes"
            params={{
              has_insurance: 'yes',
              insurance_type: insurance.type,
              insurance_membership_status: insurance.membership_status,
              insurance_membership_number: insurance.membership_number,
              insurance_expiry_date: insurance.expiry_date,
              insurance_claim_code: insurance.claim_code,
              insurance_scheme_name: insurance.scheme_name,
            }}
            onSubmit={(params, { setSubmitting, setErrors }) => {
              updatePatientService(params, patient.id)
                .then(() => {
                  mutate();
                  toast.success('Insurance updated');
                })
                .catch((error) => {
                  if (error?.fields) {
                    return setErrors(error.fields);
                  }

                  if (error?.message) {
                    return toast.error(error.message);
                  }
                })
                .finally(() => setSubmitting(false));
            }}
          />
        </div>
      )}

      {!insurance && (
        <div className="max-w-[328px] w-full mx-auto text-center">
          <div className="h-10 w-10 rounded-full bg-gray-100 flex mx-auto mb-4">
            <ShieldPlusIcon variant="solid" className="text-primary m-auto" />
          </div>
          <div className="mb-6">
            <p className="font-bold mb-1">This patient has no insurance</p>
            <p className="text-sm font-medium text-muted">
              You can add an insurance by clicking the add insurance button
              below
            </p>
          </div>
          <AddForm>
            {({ proceed }) => (
              <Button onClick={() => proceed()} className="btn-primary mx-auto">
                <AddIcon />
                <span>Add insurance</span>
              </Button>
            )}
          </AddForm>
        </div>
      )}
    </div>
  );
}

export default Insurance;
