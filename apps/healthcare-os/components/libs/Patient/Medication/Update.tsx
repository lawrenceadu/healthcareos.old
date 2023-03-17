import { ReactElement, useState } from 'react';
import { Modal } from '@healthcareos/react';

import { PrescriptionModel } from '../../../../models';
import Form from './Form';

export interface UpdateProps {
  prescription: PrescriptionModel;
  children: (props: { proceed: () => void }) => ReactElement;
}

function Update({ prescription, children }: UpdateProps) {
  /**
   * state
   */
  const [show, setShow] = useState(false);

  return (
    <>
      {children({ proceed: () => setShow(true) })}

      <Modal
        size="xl"
        index={2}
        show={show}
        onHide={() => setShow(false)}
        header="Update prescription"
      >
        <div className="max-h-[600px] pt-6 overflow-y-auto">
          <Form
            params={prescription}
            onHide={() => setShow(false)}
            onSuccess={() => setShow(false)}
          />
        </div>
      </Modal>
    </>
  );
}

export default Update;
