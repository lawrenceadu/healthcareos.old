import { Fragment, useState } from 'react';
import { Badge, Button, Dropdown, Field, Paginate } from '@healthcareos/react';
import { DotsHorizIcon } from '@healthcare/icons';
import queryString from 'query-string';
import useSWR from 'swr';

import { useRoles, usePermissions } from '../../../../hooks';
import { UserModel } from '../../../../models';
import DropdownFilter from '../../../libs/DropdownFilter';

import CreateForm from './Members/Create';
import Skeleton from '../../../libs/Skeleton';

export default function Members() {
  /**
   * context
   */
  const [filters, setFilters] = useState<any>({ page: 0 });

  /**
   * perm
   */
  const [canView, canAdd] = usePermissions('user_view', 'user_add');

  /**
   * api
   */
  const { data, error, mutate } = useSWR<{ users: UserModel[]; total: number }>(
    canView &&
      `/user?${queryString.stringify({
        ...filters,
        page: (filters?.page || 0) + 1,
      })}`
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

        {canAdd && (
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
        )}
      </div>

      <div className="overflow-x-auto mb-8">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Role</th>
              <th>Status</th>
              <th className="text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {!data && !error && <Skeleton.Table count={4} />}

            {data && (
              <>
                {!users.length && (
                  <tr>
                    <td colSpan={4}>
                      <p className="text-center">No members yet</p>
                    </td>
                  </tr>
                )}

                {users.map((user, key) => (
                  <Fragment key={key}>
                    {!user.email.includes('qodehub') && (
                      <tr>
                        <td>{user.name || '--'}</td>
                        <td>{user?.role?.name || '--'}</td>
                        <td>
                          <Badge variant="success">active</Badge>
                        </td>
                        <td>
                          <Dropdown>
                            <Dropdown.Toggle className="mx-auto">
                              <DotsHorizIcon />
                            </Dropdown.Toggle>
                            <Dropdown.Menu></Dropdown.Menu>
                          </Dropdown>
                        </td>
                      </tr>
                    )}
                  </Fragment>
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
