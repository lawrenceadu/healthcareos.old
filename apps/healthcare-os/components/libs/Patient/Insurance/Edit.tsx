import { useState } from 'react';
import { Modal } from '@healthcareos/react';
import { toast } from 'react-toastify';

import { createOrUpdateInsuranceService, updatePatientService } from '../../../../services/patient'; // prettier-ignore
import { InsuranceModel } from '../../../../models';
import { usePatient } from '../../../../hooks';
import Insurance from '../../Onboarding/Insurance';

export interface EditProps {
  insurance: InsuranceModel;
  insuranceMutate: () => void;
  children: (props: { proceed: () => void }) => void;
}

export function Edit({ insurance, insuranceMutate, children }: EditProps) {
  /**
   * state
   */
  const [show, setShow] = useState(false);

  /**
   * hooks
   */
  const { patient, mutate } = usePatient();

  return (
    <>
      {children({ proceed: () => setShow(true) })}

      <Modal show={show} onHide={() => setShow(false)} header="Edit insurance">
        <div className="p-6">
          <Insurance
            header={false}
            button="Save changes"
            params={{
              has_insurance: 'yes',
              insurance_type: insurance.type,
              insurance_membership_status: insurance.membership_status,
              insurance_membership_number: insurance.membership_number,
              insurance_expiry_date: insurance.expiry_date,
              insurance_scheme_name: insurance.scheme_name,
            }}
            onSubmit={(params, { setSubmitting, setErrors }) => {
              createOrUpdateInsuranceService({ ...params, patient: patient.id })
                .then(() => {
                  mutate();
                  setShow(false);
                  insuranceMutate();
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
      </Modal>
    </>
  );
}

export default Edit;
