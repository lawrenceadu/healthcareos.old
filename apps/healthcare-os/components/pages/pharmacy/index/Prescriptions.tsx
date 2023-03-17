import { useState } from 'react';
import queryString from 'query-string';
import useSWR from 'swr';

import { PrescriptionModel } from '../../../../models';
import Skeleton from '../../../../components/libs/Skeleton';
import TableRow from './Prescriptions/TableRow';

function Prescriptions() {
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
      ...filters,
      page: filters?.page + 1,
    })}`
  );

  /**
   * variables
   */
  const prescriptions = data?.prescriptions || [];

  return (
    <>
      <div className="overflow-x-auto">
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
    </>
  );
}

export default Prescriptions;
