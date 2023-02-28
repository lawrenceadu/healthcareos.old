import { useContext } from 'react';
import { Button, Dropdown, Field } from '@healthcareos/react';
import { ChevronDownIcon } from '@healthcare/icons';

import { FiltersContext } from '../../../../contexts/Filters';
import DropdownFilter from '../../../libs/DropdownFilter';

import ReceiveForm from './Inventory/Receive';
import RequestForm from './Inventory/Request';
import TableRow from './Inventory/TableRow';

function Inventory() {
  /**
   * context
   */
  const { filters, setFilters } = useContext(FiltersContext);

  /**
   * functions
   */
  const handleFilter = (name: string, value: unknown) =>
    setFilters({
      ...filters,
      inventory: { ...(filters?.inventory || {}), [name]: value },
    });

  return (
    <>
      <div className="grid md:flex gap-4 mb-4">
        <Field.Search onSearch={() => null} />

        <DropdownFilter
          name="All locations"
          value={filters?.inventory?.location}
          options={[
            { label: 'Consulting room', value: '1' },
            { label: 'Maternity ward', value: '2' },
            { label: 'Pharmacy', value: '3' },
          ]}
          setValue={(value) => handleFilter('location', value)}
        />

        <DropdownFilter
          name="Last updated"
          value={filters?.inventory?.last_updated}
          options={[
            { label: 'Today', value: 'today' },
            { label: 'Yesterday', value: 'yesterday' },
            { label: 'This week', value: 'week' },
          ]}
          setValue={(value) => handleFilter('last_updated', value)}
        />

        <Dropdown className="md:ml-auto">
          <Dropdown.Toggle
            as={Button}
            type="button"
            contentClassName="!justify-between w-full"
            className="btn btn-primary !w-full md:w-auto"
          >
            <span>Actions</span>
            <ChevronDownIcon />
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <ReceiveForm>
              {({ proceed }) => (
                <Dropdown.Item onClick={() => proceed()}>Receive</Dropdown.Item>
              )}
            </ReceiveForm>
            <RequestForm>
              {({ proceed }) => (
                <Dropdown.Item onClick={() => proceed()}>
                  Make request
                </Dropdown.Item>
              )}
            </RequestForm>
          </Dropdown.Menu>
        </Dropdown>
      </div>

      <div className="overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th>Medication</th>
              <th>Units Available</th>
              <th>Expiry Date</th>
              <th className="text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 3 }, (_, i) => (
              <TableRow key={i} />
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default Inventory;
