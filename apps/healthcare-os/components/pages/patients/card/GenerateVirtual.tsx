import { ReactElement, useState } from 'react';
import { Button, Modal } from '@healthcareos/react';
import { PrintIcon } from '@healthcare/icons';
import { useRouter } from 'next/router';
import QRCode from 'react-qr-code';

import { PatientModel } from '../../../../models';
import routes from '../../../../routes';

export interface GenerateVirtualProps {
  patient: PatientModel;
  children: ({ proceed }: { proceed: () => void }) => ReactElement;
}

function GenerateVirtual({ patient, children }: GenerateVirtualProps) {
  /**
   * state
   */
  const [state, setState] = useState(false);

  /**
   * routes
   */
  const router = useRouter();

  return (
    <>
      {children({ proceed: () => setState(true) })}

      <Modal
        show={state}
        onHide={() => setState(false)}
        header="Generate ID card"
        backdrop="static"
      >
        <div className="p-6">
          <div className="mb-6 p-6 mx-auto w-[280px] border border-gray-200 rounded-lg">
            <QRCode
              size={140}
              value={'123456789012'}
              viewBox={`0 0 140 140`}
              className="mx-auto mb-6"
            />

            <div className="text-center">
              <p className="mb-4">{patient.name}</p>
              <p>1058-3135-4482</p>
            </div>
          </div>

          <div className="flex gap-4">
            <Button className="btn btn-outline w-full">
              <span>
                <PrintIcon />
              </span>
              <span>Print card</span>
            </Button>
            <Button
              className="w-full btn btn-primary"
              onClick={() => router.push(routes.dashboard.patients.new)}
            >
              Add another patient
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default GenerateVirtual;
