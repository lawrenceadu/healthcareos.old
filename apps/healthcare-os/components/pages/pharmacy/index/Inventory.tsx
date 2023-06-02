import { useState } from 'react';
import { Field, Paginate } from '@healthcareos/react';
import queryString from 'query-string';
import useSWR from 'swr';

import { MedicineInventoryModel } from '../../../../models';
import TableRow from './Inventory/TableRow';
import Skeleton from '../../../libs/Skeleton';

function Inventory() {
  /**
   * context
   */
  const [filters, setFilters] = useState<any>({ page: 0 });

  /**
   * hooks
   */
  // const locations = useLocations();

  /**
   * api
   */
  const { data, error } = useSWR<{
    medicines: MedicineInventoryModel[];
    total: number;
  }>(
    `/medicine/inventory?${queryString.stringify({
      ...filters,
      per_page: 10,
      page: (filters?.page || 0) + 1,
    })}`
  );

  /**
   * variables
   */
  const medicines = data?.medicines || [];

  return (
    <>
      <div className="grid md:flex gap-4 mb-4">
        <Field.Search
          onSearch={(search) =>
            setFilters((filters) => ({ ...filters, search }))
          }
        />
      </div>

      <div className="overflow-x-auto mb-8">
        <table>
          <thead>
            <tr>
              <th>Medication</th>
              <th className="text-right">Units Available</th>
            </tr>
          </thead>
          <tbody>
            {!data && !error && <Skeleton.Table count={2} />}

            {data && (
              <>
                {!medicines.length && (
                  <tr>
                    <td colSpan={2}>
                      <p className="text-center">No inventory yet</p>
                    </td>
                  </tr>
                )}

                {medicines.map((medicine, key) => (
                  <TableRow key={key} {...{ medicine }} />
                ))}
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

export default Inventory;
