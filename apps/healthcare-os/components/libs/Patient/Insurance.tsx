import { AddIcon, ShieldPlusIcon } from '@healthcare/icons';
import { Button } from '@healthcareos/react';

import AddForm from './Insurance/Add';
import Onboarding from '../Onboarding';

export function Insurance() {
  /**
   * variable
   */
  const hasInsurance = true;

  return (
    <div>
      {hasInsurance && (
        <div className="max-w-[424px]">
          <Onboarding.Insurance
            header={false}
            button="Save changes"
            params={{ has_insurance: 'yes', insurance_type: 'nhis' }}
            onSubmit={(params, { setSubmitting }) => {
              return;
            }}
          />
        </div>
      )}

      {!hasInsurance && (
        <div className="max-w-[328px] w-full mx-auto text-center">
          <div className="h-10 w-10 rounded-full bg-gray-100 flex mx-auto mb-4">
            <ShieldPlusIcon variant="solid" className="text-primary m-auto" />
          </div>
          <div className="mb-6">
            <p className="font-bold mb-1">This patient has no insurance</p>
            <p className="text-sm font-medium text-muted">
              You can add an insurance by clicking the add insurance button
              below
            </p>
          </div>
          <AddForm>
            {({ proceed }) => (
              <Button onClick={() => proceed()} className="btn-primary mx-auto">
                <AddIcon />
                <span>Add insurance</span>
              </Button>
            )}
          </AddForm>
        </div>
      )}
    </div>
  );
}

export default Insurance;
