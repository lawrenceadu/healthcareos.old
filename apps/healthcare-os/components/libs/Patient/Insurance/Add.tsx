import { useState } from 'react';
import { Modal } from '@healthcareos/react';
import Insurance from '../../Onboarding/Insurance';

export interface AddProps {
  children: (props: { proceed: () => void }) => void;
}

export function Add({ children }: AddProps) {
  /**
   * state
   */
  const [state, setState] = useState(false);

  return (
    <>
      {children({ proceed: () => setState(true) })}

      <Modal show={state} onHide={() => setState(false)} header="Add insurance">
        <div className="p-6">
          <Insurance
            button="Add insurance"
            params={{ has_insurance: 'yes', insurance_type: 'nhis' }}
            onSubmit={(params, { setSubmitting }) => {
              return;
            }}
          />
        </div>
      </Modal>
    </>
  );
}

export default Add;
