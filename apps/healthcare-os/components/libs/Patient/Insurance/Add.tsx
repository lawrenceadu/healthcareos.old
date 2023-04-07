import { useState } from 'react';
import { Modal } from '@healthcareos/react';
import { toast } from 'react-toastify';

import { updatePatientService } from '../../../../services/patient';
import { usePatient } from '../../../../hooks';
import Insurance from '../../Onboarding/Insurance';

export interface AddProps {
  children: (props: { proceed: () => void }) => void;
}

export function Add({ children }: AddProps) {
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

      <Modal show={show} onHide={() => setShow(false)} header="Add insurance">
        <div className="p-6">
          <Insurance
            button="Add insurance"
            params={{ has_insurance: 'yes', insurance_type: 'nhis' }}
            onSubmit={(params, { setSubmitting, setErrors }) => {
              updatePatientService(params, patient.id)
                .then(() => {
                  toast.success('Insurance added');
                  setShow(false);
                  mutate();
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

export default Add;
