import { useState } from 'react';
import { Badge, Button, Dropdown, Field } from '@healthcareos/react';
import { DotsHorizIcon } from '@healthcare/icons';
import queryString from 'query-string';
import useSWR from 'swr';

import { UserModel } from '../../../models';
import { useRoles } from '../../../hooks';
import DropdownFilter from '../../libs/DropdownFilter';

import ReactivateConfirm from '../members/index/Members/Reactivate';
import SuspendConfirm from '../members/index/Members/Suspend';
import RemoveConfirm from '../members/index/Members/Remove';
import RevokeConfirm from '../members/index/Members/Revoke';
import CreateForm from '../members/index/Members/Create';
import EditForm from '../members/index/Members/Edit';

export default function Members() {
  /**
   * context
   */
  const [filters, setFilters] = useState<any>({ page: 0 });

  /**
   * api
   */
  const { mutate } = useSWR<{ users: UserModel[]; total: number }>(
    `/user?${queryString.stringify({
      ...filters,
      per_page: 10,
      page: (filters?.page || 0) + 1,
    })}`
  );

  /**
   * hooks
   */
  const roles = useRoles();

  return (
    <div>
      <div className="grid md:flex gap-4 mb-6">
        <Field.Search
          onSearch={(search) =>
            setFilters((filters) => ({ ...filters, search }))
          }
        />

        <DropdownFilter
          name="All roles"
          value={filters?.members?.role}
          options={roles.map((role) => ({ label: role.name, value: role.id }))}
          setValue={(value) =>
            setFilters((filters) => ({ ...filters, role: value }))
          }
        />

        <CreateForm {...{ mutate }}>
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
