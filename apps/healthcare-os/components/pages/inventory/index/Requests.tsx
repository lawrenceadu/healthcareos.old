import { useContext } from 'react';
import { Badge, Dropdown, Field } from '@healthcareos/react';
import { DotsHorizIcon } from '@healthcare/icons';

import { FiltersContext } from '../../../../context/Filters';
import DropdownFilter from '../../../libs/DropdownFilter';
import FulfilForm from './Requests/Fulfil';

function Requests() {
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
      requests: { ...(filters?.requests || {}), [name]: value },
    });

  return (
    <>
      <div className="grid md:flex gap-4 mb-4">
        <Field.Search onSearch={(value) => handleFilter('search', value)} />

        <DropdownFilter
          name="All locations"
          value={filters?.requests?.location}
          options={[
            { label: 'Consulting room', value: '1' },
            { label: 'Maternity ward', value: '2' },
            { label: 'Pharmacy', value: '3' },
          ]}
          setValue={(value) => handleFilter('location', value)}
        />

        <DropdownFilter
          name="All statuses"
          value={filters?.requests?.status}
          options={[
            { label: 'Fulfilled', value: 'fulfilled' },
            { label: 'Pending', value: 'pending' },
            { label: 'Rejected', value: 'rejected' },
          ]}
          setValue={(value) => handleFilter('status', value)}
        />
      </div>

      <div className="overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th>Requested by</th>
              <th>Location</th>
              <th>Product</th>
              <th>Status</th>
              <th>Date Processed</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {['fulfilled', 'fulfilled', 'pending', 'fulfilled', 'rejected'].map(
              (i, key) => (
                <tr key={key}>
                  <td>
                    <p>Doctor Kim Jones</p>
                    <small className="text-muted">10/01/2023</small>
                  </td>
                  <td>Consulting room</td>
                  <td>Sodium Chloride 0.9 solution for infusion 1 litre</td>
                  <td>
                    <Badge variant={i}>{i}</Badge>
                  </td>
                  <td>10/01/2023</td>
                  <td>
                    <Dropdown>
                      <Dropdown.Toggle>
                        <DotsHorizIcon />
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        {i === 'pending' && (
                          <>
                            <FulfilForm request>
                              {({ proceed }) => (
                                <Dropdown.Item onClick={() => proceed()}>
                                  Fulfil request
                                </Dropdown.Item>
                              )}
                            </FulfilForm>
                          </>
                        )}
                      </Dropdown.Menu>
                    </Dropdown>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default Requests;
