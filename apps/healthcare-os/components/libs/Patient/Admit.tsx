import { useState } from 'react';
import { Modal } from '@healthcareos/react';

import Form from './Admission/Form';

export interface AdmitProps {
  children: (props: { proceed: () => void }) => void;
}

function Admit({ children }: AdmitProps) {
  /**
   * state
   */
  const [show, setShow] = useState(false);

  return (
    <>
      {children({ proceed: () => setShow(true) })}

      <Modal show={show} onHide={() => setShow(false)} header="Admit patient">
        <Form type="admit" button="Admit" onSuccess={() => setShow(false)} />
      </Modal>
    </>
  );
}

export default Admit;
