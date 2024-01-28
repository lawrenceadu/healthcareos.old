import React, { ReactNode, useState } from 'react';
import { Modal } from '@healthcareos/react';
import { toast } from 'react-toastify';

import { createInsuranceClaimBatchService } from '../../../../services/insurance';
import Form from './Form';

export interface CreateProps {
  onSuccess: () => void;
  children: (props: { proceed: () => void }) => ReactNode;
}

function Create({ onSuccess, children }: CreateProps) {
  /**
   * state
   */
  const [show, setShow] = useState(false);

  return (
    <>
      {children({ proceed: () => setShow(true) })}

      <Modal show={show} onHide={() => setShow(false)} header="Create Batch">
        <div className="p-6">
          <Form
            onSubmit={(params, { setSubmitting, setErrors }) => {
              createInsuranceClaimBatchService(params)
                .then(() => {
                  onSuccess();
                  setShow(false);
                })
                .catch((error) => {
                  if (error?.fields) setErrors(error.fields || {});
                  else toast.error('Unable to create batch');
                })
                .finally(() => setSubmitting(false));
            }}
          />
        </div>
      </Modal>
    </>
  );
}

export default Create;
