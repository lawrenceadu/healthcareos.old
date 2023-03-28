import { useState } from 'react';
import { Field } from '@healthcareos/react';
import queryString from 'query-string';
import useSWR from 'swr';

import { MedicineInventoryModel } from '../../../../models';
import { useLocations } from '../../../../hooks';
import DropdownFilter from '../../../libs/DropdownFilter';
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
  const locations = useLocations();

  /**
   * api
   */
  const { data, error, mutate } = useSWR<{
    medicines: MedicineInventoryModel[];
    total: number;
  }>(
    `/medicine/inventory?${queryString.stringify({
      ...filters,
      page: filters?.page + 1,
    })}`
  );

  /**
   * variables
   */
  const medicines = data?.medicines || [];

  return (
    <>
      <div className="grid md:flex gap-4 mb-4">
        <Field.Search onSearch={() => null} />

        <DropdownFilter
          name="All locations"
          value={filters?.location}
          options={locations.map((i) => ({ label: i.name, value: i.id }))}
          setValue={(value) =>
            setFilters((filters) => ({ ...filters, location: value }))
          }
        />
      </div>

      <div className="overflow-x-auto">
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
    </>
  );
}

export default Inventory;
