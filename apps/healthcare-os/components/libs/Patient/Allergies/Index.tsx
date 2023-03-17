import { VirusIcon } from '@healthcare/icons';
import { Button } from '@healthcareos/react';
import useSWR from 'swr';

import { AllergyModel } from '../../../../models';
import { usePatient } from '../../../../hooks';
import Allergy from './Allergy';

function Index({ onHide }: { onHide: () => void }) {
  /**
   * hook
   */
  const { patient } = usePatient();

  /**
   * api
   */
  const { data, error, mutate } = useSWR<{ allergies: AllergyModel[] }>(
    `/allergy?patient=${patient.id}`
  );

  return (
    <>
      <div className="px-6 pb-6">
        {/* loading */}
        {!data && !error && (
          <div className="flex flex-col gap-6">
            {Array.from({ length: 2 }, (_, i) => (
              <div key={i} className="h-[72px] bg-neutral-100 animate-pulse" />
            ))}
          </div>
        )}

        {data && (
          <>
            {!!data.allergies.length && (
              <div className="flex flex-col gap-6">
                {data.allergies.map((allergy, key) => (
                  <Allergy
                    key={key}
                    className="p-4 border border-gray-200 rounded-lg"
                    {...{ mutate, allergy }}
                  />
                ))}
              </div>
            )}

            {!data.allergies.length && (
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
          </>
        )}
      </div>
      <div className="px-6 py-3 flex justify-end border-t border-gray-200">
        <Button type="button" className="btn-light" onClick={() => onHide()}>
          Cancel
        </Button>
      </div>
    </>
  );
}

export default Index;
