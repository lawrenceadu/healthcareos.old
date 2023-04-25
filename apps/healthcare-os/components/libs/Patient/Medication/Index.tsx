import { useState } from 'react';
import { DrugIcon } from '@healthcare/icons';
import { Paginate } from '@healthcareos/react';
import queryString from 'query-string';
import useSWR from 'swr';

import { PrescriptionModel } from '../../../../models';
import { usePatient } from '../../../../hooks';
import Prescription from './Prescription';

export function Medication({
  onHide,
  setTab,
}: {
  onHide: () => void;
  setTab: (key: string) => void;
}) {
  /**
   * hook
   */
  const { patient } = usePatient();

  /**
   * state
   */
  const [filters, setFilters] = useState<any>({ page: 0 });

  /**
   * api
   */
  const { data, error, mutate } = useSWR<{
    prescriptions: PrescriptionModel[];
    total: number;
  }>(
    `/prescription?${queryString.stringify({
      patient: patient.id,
      page: (filters?.page || 0) + 1,
      per_page: 10,
    })}`
  );

  /**
   * variables
   */
  const prescriptions = data?.prescriptions || [];

  return (
    <div className="px-6 pb-6">
      {!data &&
        !error &&
        Array.from({ length: 2 }, (_, i) => (
          <div
            key={i}
            className="bg-neutral-100 h-[172px] rounded-lg animate-pulse mb-6"
          />
        ))}

      {data && (
        <>
          {!prescriptions.length && (
            <div className="max-w-[328px] w-full mx-auto text-center">
              <div className="h-10 w-10 rounded-full bg-gray-100 flex mx-auto mb-4">
                <DrugIcon variant="solid" className="text-primary m-auto" />
              </div>
              <div>
                <p className="font-bold mb-1">No prescription yet</p>
                <p className="text-sm font-medium text-muted">
                  This patient hasn&apos;t received any prescription yet.
                </p>
              </div>
            </div>
          )}

          {!!prescriptions.length && (
            <div>
              <div className="grid gap-4 mb-8">
                {prescriptions.map((prescription, key) => (
                  <Prescription key={key} {...{ mutate, prescription }} />
                ))}
              </div>

              <div className="flex justify-center">
                <Paginate
                  pageCount={Math.ceil(data.total / 10)}
                  page={filters?.page}
                  setPage={(page) =>
                    setFilters((filters) => ({ ...filters, page }))
                  }
                />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Medication;
