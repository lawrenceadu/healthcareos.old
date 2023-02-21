import { AddIcon, VirusIcon } from '@healthcare/icons';
import { Button } from '@healthcareos/react';

import Prescription from './Allergies/Allergy';
import AddForm from './Allergies/Add';

export function Allergies() {
  /**
   * variables
   */
  const hasAllergies = true;

  return (
    <>
      {hasAllergies && (
        <div>
          <div className="flex justify-end mb-4">
            <AddForm>
              {({ proceed }) => (
                <Button onClick={() => proceed()} className="btn-secondary">
                  Add allergy
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

      {!hasAllergies && (
        <div className="max-w-[328px] w-full mx-auto text-center">
          <div className="h-10 w-10 rounded-full bg-gray-100 flex mx-auto mb-4">
            <VirusIcon variant="solid" className="text-primary m-auto" />
          </div>
          <div className="mb-6">
            <p className="font-bold mb-1">No allergies added yet</p>
            <p className="text-sm font-medium text-muted">
              This patient doesn&apos;t have any allergies listed.
            </p>
          </div>
          <AddForm>
            {({ proceed }) => (
              <Button onClick={() => proceed()} className="btn-primary mx-auto">
                <AddIcon />
                <span>Add allergies</span>
              </Button>
            )}
          </AddForm>
        </div>
      )}
    </>
  );
}

export default Allergies;
