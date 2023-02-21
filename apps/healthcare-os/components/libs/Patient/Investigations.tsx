import { AddIcon, StethoscopeIcon } from '@healthcare/icons';
import { Button } from '@healthcareos/react';

import Investigation from './Investigations/Investigation';
import AddForm from './Investigations/Add';

export function Investigations() {
  /**
   * variables
   */
  const hasInvestigations = true;

  return (
    <div>
      {hasInvestigations && (
        <div>
          <div className="flex justify-end mb-4">
            <AddForm>
              {({ proceed }) => (
                <Button onClick={() => proceed()} className="btn-secondary">
                  Add investigation
                </Button>
              )}
            </AddForm>
          </div>
          <div className="flex flex-col gap-6">
            {Array.from({ length: 2 }, (_, i) => (
              <Investigation
                key={i}
                className="p-4 border border-gray-200 rounded-lg"
              />
            ))}
          </div>
        </div>
      )}

      {!hasInvestigations && (
        <div className="max-w-[328px] w-full mx-auto text-center">
          <div className="h-10 w-10 rounded-full bg-gray-100 flex mx-auto mb-4">
            <StethoscopeIcon variant="solid" className="text-primary m-auto" />
          </div>
          <div className="mb-6">
            <p className="font-bold mb-1">No investigation yet</p>
            <p className="text-sm font-medium text-muted">
              Investigation add for this patient will appear here.
            </p>
          </div>
          <AddForm>
            {({ proceed }) => (
              <Button onClick={() => proceed()} className="btn-primary mx-auto">
                <AddIcon />
                <span>Add investigation</span>
              </Button>
            )}
          </AddForm>
        </div>
      )}
    </div>
  );
}

export default Investigations;
