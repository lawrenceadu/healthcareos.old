import { AddIcon, ConsultationIcon } from '@healthcare/icons';
import { Button } from '@healthcareos/react';

import AddForm from './Consultation/Add';
import Item from './Consultation/Consultation';

export function Consultation() {
  /**
   * variables
   */
  const hasConsultants = true;

  return (
    <>
      {hasConsultants && (
        <div>
          <div className="flex justify-end mb-4">
            <AddForm>
              {({ proceed }) => (
                <Button onClick={() => proceed()} className="btn-secondary">
                  Add consultation
                </Button>
              )}
            </AddForm>
          </div>
          <div className="flex flex-col gap-6">
            {Array.from({ length: 2 }, (_, i) => (
              <Item key={i} className="p-4 border border-gray-200 rounded-lg" />
            ))}
          </div>
        </div>
      )}

      {!hasConsultants && (
        <div className="max-w-[328px] w-full mx-auto text-center">
          <div className="h-10 w-10 rounded-full bg-gray-100 flex mx-auto mb-4">
            <ConsultationIcon variant="solid" className="text-primary m-auto" />
          </div>
          <div className="mb-6">
            <p className="font-bold mb-1">This patient has no consultations</p>
            <p className="text-sm font-medium text-muted">
              You can add a consultation by clicking the add consultation button
              below
            </p>
          </div>
          <AddForm>
            {({ proceed }) => (
              <Button onClick={() => proceed()} className="btn-primary mx-auto">
                <AddIcon />
                <span>Add consultation</span>
              </Button>
            )}
          </AddForm>
        </div>
      )}
    </>
  );
}

export default Consultation;
