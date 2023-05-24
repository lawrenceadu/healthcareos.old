import { useState } from 'react';
import { Paginate } from '@healthcareos/react';
import queryString from 'query-string';
import useSWR from 'swr';

import { PrescriptionModel } from '../../../../models';
import { usePermissions } from '../../../../hooks';
import Skeleton from '../../../../components/libs/Skeleton';
import TableRow from './Prescriptions/TableRow';

function Prescriptions() {
  /**
   * state
   */
  const [filters, setFilters] = useState<any>({ page: 0 });

  /**
   * perm
   */
  const [canView] = usePermissions('prescription_view');

  /**
   * api
   */
  const { data, error, mutate } = useSWR<{
    prescriptions: PrescriptionModel[];
    total: number;
  }>(
    canView &&
      `/prescription?${queryString.stringify({
        ...filters,
        per_page: 10,
        page: (filters?.page || 0) + 1,
      })}`
  );

  /**
   * variables
   */
  const prescriptions = data?.prescriptions || [];

  console.log(prescriptions);

  return (
    <>
      <div className="overflow-x-auto mb-8">
        <table>
          <thead>
            <tr>
              <th>Patient</th>
              <th>Medicines</th>
              <th>Prescribed by</th>
              <th>Prescription date</th>
              <th>Status</th>
              <th className="text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {!data && !error && <Skeleton.Table count={5} />}
            {data && (
              <>
                {!prescriptions.length && (
                  <tr>
                    <td colSpan={5}>
                      <p className="text-center">No prescriptions yet</p>
                    </td>
                  </tr>
                )}

                {!!prescriptions.length && (
                  <>
                    {prescriptions.map((prescription, key) => (
                      <TableRow {...{ prescription, mutate }} key={key} />
                    ))}
                  </>
                )}
              </>
            )}
          </tbody>
        </table>
      </div>
      {data && (
        <div className="flex justify-end">
          <Paginate
            page={filters?.page}
            pageCount={Math.ceil(data.total / 10)}
            setPage={(page) => setFilters((filters) => ({ ...filters, page }))}
          />
        </div>
      )}
    </>
  );
}

export default Prescriptions;
