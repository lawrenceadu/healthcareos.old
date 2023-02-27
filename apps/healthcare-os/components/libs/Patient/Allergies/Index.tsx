import { VirusIcon } from '@healthcare/icons';

import Allergy from './Allergy';
import { Button } from '@healthcareos/react';

function Index({ onHide }: { onHide: () => void }) {
  const hasAllergies = true;

  return (
    <>
      <div className="px-6 pb-6">
        {hasAllergies && (
          <div className="flex flex-col gap-6">
            {Array.from({ length: 2 }, (_, i) => (
              <Allergy
                key={i}
                className="p-4 border border-gray-200 rounded-lg"
              />
            ))}
          </div>
        )}

        {!hasAllergies && (
          <div className="max-w-[328px] h-[150px] w-full mx-auto text-center">
            <div className="h-10 w-10 rounded-full bg-gray-100 flex mx-auto mb-4">
              <VirusIcon variant="solid" className="text-primary m-auto" />
            </div>
            <div>
              <p className="font-bold mb-1">No allergies added yet</p>
              <p className="text-sm font-medium text-muted">
                This patient doesn&apos;t have any allergies listed.
              </p>
            </div>
          </div>
        )}
      </div>
      <div className="px-6 py-3 flex justify-end border-t border-gray-200">
        <Button className="btn-light" onClick={() => onHide()}>
          Cancel
        </Button>
      </div>
    </>
  );
}

export default Index;
