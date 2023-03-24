import { useState } from 'react';
import { Badge, Button, Dropdown, Field, Paginate } from '@healthcareos/react';
import { DotsHorizIcon } from '@healthcare/icons';
import queryString from 'query-string';
import useSWR from 'swr';

import { UserModel } from '../../../../models';
import { useRoles } from '../../../../hooks';
import DropdownFilter from '../../../libs/DropdownFilter';

import ReactivateConfirm from './Members/Reactivate';
import SuspendConfirm from './Members/Suspend';
import RemoveConfirm from './Members/Remove';
import RevokeConfirm from './Members/Revoke';
import CreateForm from './Members/Create';
import EditForm from './Members/Edit';
import Skeleton from '../../../libs/Skeleton';

export default function Members() {
  /**
   * context
   */
  const [filters, setFilters] = useState<any>({ page: 0 });

  /**
   * api
   */
  const { data, error, mutate } = useSWR<{ users: UserModel[]; total: number }>(
    `/user?${queryString.stringify({ ...filters, page: filters?.page + 1 })}`
  );

  /**
   * variables
   */
  const users = data?.users || [];

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

      <div className="overflow-x-auto mb-8">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Role</th>
              <th>Status</th>
              <th>Last Active</th>
              <th className="text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {!data && !error && <Skeleton.Table count={5} />}

            {data && (
              <>
                {!users.length && (
                  <tr>
                    <td colSpan={5}>
                      <p className="text-center">No members yet</p>
                    </td>
                  </tr>
                )}

                {users.map((user, key) => (
                  <tr key={key}>
                    <td>{user.name || '--'}</td>
                    <td>{user?.role?.name || '--'}</td>
                    <td>
                      <Badge variant="success">active</Badge>
                    </td>
                    <td>Online</td>
                    <td>
                      <Dropdown>
                        <Dropdown.Toggle className="mx-auto">
                          <DotsHorizIcon />
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          {/* {['active'].includes(status) && (
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
                      )} */}
                        </Dropdown.Menu>
                      </Dropdown>
                    </td>
                  </tr>
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
            setPage={(page) =>
              setFilters((filters) => setFilters({ ...filters, page }))
            }
          />
        </div>
      )}
    </div>
  );
}
