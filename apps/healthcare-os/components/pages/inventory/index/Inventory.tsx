import { useState } from 'react';
import { Button, Dropdown, Field } from '@healthcareos/react';
import { ChevronDownIcon } from '@healthcare/icons';
import queryString from 'query-string';
import useSWR from 'swr';

import { ItemInventoryModel } from '../../../../models';
import { useLocations } from '../../../../hooks';
import DropdownFilter from '../../../libs/DropdownFilter';
import TableRow from './Inventory/TableRow';

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
    items: ItemInventoryModel[];
    total: number;
  }>(
    `/item/inventory?${queryString.stringify({
      ...filters,
      per_page: 10,
      page: (filters?.page || 0) + 1,
    })}`
  );

  /**
   * variables
   */
  const items = data?.items || [];

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
            {items.map((item, key) => (
              <TableRow key={key} {...{ item }} />
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default Inventory;
