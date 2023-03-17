import { DrugIcon } from '@healthcare/icons';
import useSWR from 'swr';

import { InvestigationRequestModel } from '../../../../models';
import { usePatient } from '../../../../hooks';
import Investigation from './Investigation';

export function Medication({
  onHide,
  setTab,
}: {
  onHide: () => void;
  setTab: (key: string) => void;
}) {
  /**
   * hooks
   */
  const { patient } = usePatient();

  /**
   * api
   */
  const { data, error, mutate } = useSWR<{
    investigations: InvestigationRequestModel[];
  }>(`/investigation/request?patient=${patient?.id}`);

  /**
   * variables
   */
  const investigations = data?.investigations || [];

  return (
    <>
      {/* loading */}
      {!data && !error && (
        <div className="px-6 grid gap-6 pb-10">
          {Array.from({ length: 2 }, (_, i) => (
            <div
              key={i}
              className="rounded-lg bg-neutral-100 h-[174px] animate-pulse"
            />
          ))}
        </div>
      )}

      {data && (
        <>
          {!investigations.length && (
            <div className="max-w-[328px] w-full mx-auto text-center px-6 pb-10">
              <div className="h-10 w-10 rounded-full bg-gray-100 flex mx-auto mb-4">
                <DrugIcon variant="solid" className="text-primary m-auto" />
              </div>
              <div>
                <p className="font-bold mb-1">No investigation requests yet</p>
                <p className="text-sm font-medium text-muted">
                  This patient has no investigation requests yet.
                </p>
              </div>
            </div>
          )}

          {!!investigations.length && (
            <div className="flex flex-col gap-6 px-6 pb-10">
              {investigations.map((investigation, key) => (
                <Investigation
                  key={key}
                  mutate={mutate}
                  investigation={investigation}
                />
              ))}
            </div>
          )}
        </>
      )}
    </>
  );
}

export default Medication;
