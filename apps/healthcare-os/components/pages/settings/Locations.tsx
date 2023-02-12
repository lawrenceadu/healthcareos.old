import React, { useContext } from 'react';
import { Button, Dropdown, Field } from '@healthcareos/react';
import { DotsHorizIcon } from '@healthcare/icons';

import { FiltersContext } from '../../../context/Filters';
import DropdownFilter from '../../libs/DropdownFilter';

import CreateForm from './Locations/Create';
import EditForm from './Locations/Edit';

export default function Locations() {
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
      locations: { ...(filters?.locations || {}), [name]: value },
    });

  return (
    <div>
      <div className="grid md:flex gap-4 mb-6">
        <Field.Search onSearch={() => null} />

        <DropdownFilter
          name="Added by"
          value={filters?.locations?.added_by}
          options={[{ label: 'Lawrence Adu', value: 'lawrence' }]}
          setValue={(value) => handleFilter('added_by', value)}
        />

        <Field.Group
          name="date"
          withFormik={false}
          wrapperClassName="!mb-0 md:max-w-[190px]"
        >
          <Field.Date
            name="date"
            placeholder="Date added"
            value={filters?.locations?.date}
            setFieldValue={(name, value) => handleFilter(name, value)}
          />
        </Field.Group>
        <CreateForm>
          {({ proceed }) => (
            <Button
              onClick={() => proceed()}
              className="btn btn-primary w-full md:w-auto md:ml-auto"
            >
              Add new location
            </Button>
          )}
        </CreateForm>
      </div>

      <div className="overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Added by</th>
              <th>Date Added</th>
              <th className="text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Consulting room 1</td>
              <td>Doctor Agnes Ofori</td>
              <td>06-Jan-2023</td>
              <td>
                <Dropdown>
                  <Dropdown.Toggle className="mx-auto">
                    <DotsHorizIcon />
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <EditForm>
                      {({ proceed }) => (
                        <Dropdown.Item onClick={() => proceed()}>
                          Edit location
                        </Dropdown.Item>
                      )}
                    </EditForm>
                  </Dropdown.Menu>
                </Dropdown>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
