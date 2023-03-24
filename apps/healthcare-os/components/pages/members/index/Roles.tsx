import { useState } from 'react';
import { Button, Dropdown, Field, Paginate } from '@healthcareos/react';
import { DotsHorizIcon, PlusIcon } from '@healthcare/icons';
import queryString from 'query-string';
import useSWR from 'swr';

import { RoleModel } from '../../../../models';
import DropdownFilter from '../../../libs/DropdownFilter';
import CreateForm from './Roles/Form';
import Skeleton from '../../../libs/Skeleton';
import TableRow from './Roles/TableRow';

export default function Roles() {
  /**
   * context
   */
  const [filters, setFilters] = useState<any>({ page: 0 });

  /**
   * api
   */
  const { data, error, mutate } = useSWR<{ roles: RoleModel[]; total: number }>(
    `/role?${queryString.stringify({ ...filters, page: filters?.page + 1 })}`
  );

  /**
   * variables
   */
  const roles = data?.roles || [];

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
              <PlusIcon />
              <span>Add</span>
            </Button>
          )}
        </CreateForm>
      </div>

      <div className="overflow-x-auto mb-8">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Code</th>
              <th className="text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {!data && !error && <Skeleton.Table count={5} />}

            {data && (
              <>
                {!roles.length && (
                  <tr>
                    <td colSpan={2}>
                      <p className="text-center">No members yet</p>
                    </td>
                  </tr>
                )}

                {roles.map((role, key) => (
                  <TableRow key={key} {...{ role, mutate }} />
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
