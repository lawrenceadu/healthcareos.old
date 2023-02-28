import React, { useContext } from 'react';
import { Badge, Button, Dropdown, Field } from '@healthcareos/react';
import { DotsHorizIcon } from '@healthcare/icons';

import { FiltersContext } from '../../../contexts/Filters';
import DropdownFilter from '../../libs/DropdownFilter';

import ReactivateConfirm from './Members/Reactivate';
import SuspendConfirm from './Members/Suspend';
import RemoveConfirm from './Members/Remove';
import RevokeConfirm from './Members/Revoke';
import CreateForm from './Members/Create';
import EditForm from './Members/Edit';

export default function Members() {
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
      members: { ...(filters?.members || {}), [name]: value },
    });

  return (
    <div>
      <div className="grid md:flex gap-4 mb-6">
        <Field.Search onSearch={() => null} />

        <DropdownFilter
          name="All roles"
          value={filters?.members?.role}
          options={[{ label: 'Doctor', value: 'doctor' }]}
          setValue={(value) => handleFilter('role', value)}
        />

        <DropdownFilter
          name="All statuses"
          value={filters?.members?.status}
          options={[{ label: 'Pending', value: 'pending' }]}
          setValue={(value) => handleFilter('status', value)}
        />

        <CreateForm>
          {({ proceed }) => (
            <Button
              onClick={() => proceed()}
              className="btn btn-primary w-full md:w-auto md:ml-auto"
            >
              Invite member
            </Button>
          )}
        </CreateForm>
      </div>

      <div className="overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Role</th>
              <th className="text-center">Status</th>
              <th>Last Active</th>
              <th className="text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {['active', 'pending', 'suspended'].map((status, key) => (
              <tr key={key}>
                <td>Hilda Quansah</td>
                <td>Doctor</td>
                <td className="text-center">
                  <Badge variant={status}>{status}</Badge>
                </td>
                <td>Online</td>
                <td>
                  <Dropdown>
                    <Dropdown.Toggle className="mx-auto">
                      <DotsHorizIcon />
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      {['active'].includes(status) && (
                        <>
                          <EditForm>
                            {({ proceed }) => (
                              <Dropdown.Item onClick={() => proceed()}>
                                Edit role
                              </Dropdown.Item>
                            )}
                          </EditForm>

                          <SuspendConfirm member>
                            {({ proceed }) => (
                              <Dropdown.Item
                                onClick={() => proceed()}
                                className="text-red-600"
                              >
                                Suspend
                              </Dropdown.Item>
                            )}
                          </SuspendConfirm>
                        </>
                      )}

                      {['pending'].includes(status) && (
                        <RevokeConfirm member>
                          {({ proceed }) => (
                            <Dropdown.Item onClick={() => proceed()}>
                              Revoke invite
                            </Dropdown.Item>
                          )}
                        </RevokeConfirm>
                      )}

                      {['suspended'].includes(status) && (
                        <>
                          <ReactivateConfirm member>
                            {({ proceed }) => (
                              <Dropdown.Item onClick={() => proceed()}>
                                Reactivate
                              </Dropdown.Item>
                            )}
                          </ReactivateConfirm>

                          <RemoveConfirm member>
                            {({ proceed }) => (
                              <Dropdown.Item
                                onClick={() => proceed()}
                                className="text-red-600"
                              >
                                Remove
                              </Dropdown.Item>
                            )}
                          </RemoveConfirm>
                        </>
                      )}
                    </Dropdown.Menu>
                  </Dropdown>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
