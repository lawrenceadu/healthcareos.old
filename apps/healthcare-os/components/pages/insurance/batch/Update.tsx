import React, { ReactNode, useState } from 'react';
import { Modal } from '@healthcareos/react';
import { toast } from 'react-toastify';

import { updateInsuranceClaimBatchService } from '../../../../services/insurance';
import { InsuranceBatchModel } from '../../../../models';
import Form from './Form';

export interface UpdateProps {
  batch: InsuranceBatchModel;
  onSuccess: () => void;
  children: (props: { proceed: () => void }) => ReactNode;
}

function Update({ batch, onSuccess, children }: UpdateProps) {
  /**
   * state
   */
  const [show, setShow] = useState(false);

  return (
    <>
      {children({ proceed: () => setShow(true) })}

      <Modal show={show} onHide={() => setShow(false)} header="Edit Batch">
        <div className="p-6">
          <Form
            params={{ title: batch.title }}
            onSubmit={(params, { setSubmitting, setErrors }) => {
              updateInsuranceClaimBatchService(params, batch.id)
                .then(() => {
                  onSuccess();
                  setShow(false);
                })
                .catch((error) => {
                  if (error?.fields) setErrors(error.fields || {});
                  else toast.error('Unable to update batch');
                })
                .finally(() => setSubmitting(false));
            }}
          />
        </div>
      </Modal>
    </>
  );
}

export default Update;
