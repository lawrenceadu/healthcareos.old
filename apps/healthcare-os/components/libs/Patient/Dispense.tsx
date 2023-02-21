import { AddIcon, DrugIcon } from '@healthcare/icons';
import { Button } from '@healthcareos/react';

import Prescription from './Dispense/Prescription';
import AddForm from './Dispense/Add';

export function Dispense() {
  /**
   * variables
   */
  const hasDispense = true;

  return (
    <>
      {hasDispense && (
        <div>
          <div className="flex justify-end mb-4">
            <AddForm>
              {({ proceed }) => (
                <Button onClick={() => proceed()} className="btn-secondary">
                  Add prescription
                </Button>
              )}
            </AddForm>
          </div>
          <div className="flex flex-col gap-6">
            {Array.from({ length: 2 }, (_, i) => (
              <Prescription
                key={i}
                className="p-4 border border-gray-200 rounded-lg"
              />
            ))}
          </div>
        </div>
      )}

      {!hasDispense && (
        <div className="max-w-[328px] w-full mx-auto text-center">
          <div className="h-10 w-10 rounded-full bg-gray-100 flex mx-auto mb-4">
            <DrugIcon variant="solid" className="text-primary m-auto" />
          </div>
          <div className="mb-6">
            <p className="font-bold mb-1">No prescription yet</p>
            <p className="text-sm font-medium text-muted">
              This patient hasn&apos;t received any prescription yet.
            </p>
          </div>
          <AddForm>
            {({ proceed }) => (
              <Button onClick={() => proceed()} className="btn-primary mx-auto">
                <AddIcon />
                <span>Add prescription</span>
              </Button>
            )}
          </AddForm>
        </div>
      )}
    </>
  );
}

export default Dispense;
