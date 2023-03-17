import { useState } from 'react';
import { Modal } from '@healthcareos/react';

import Form from './Admission/Form';

export interface DetainProps {
  children: (props: { proceed: () => void }) => void;
}

function Detain({ children }: DetainProps) {
  /**
   * state
   */
  const [show, setShow] = useState(false);

  return (
    <>
      {children({ proceed: () => setShow(true) })}

      <Modal show={show} onHide={() => setShow(false)} header="Detain patient">
        <Form type="detain" onSuccess={() => setShow(false)} button="Detain" />
      </Modal>
    </>
  );
}

export default Detain;
