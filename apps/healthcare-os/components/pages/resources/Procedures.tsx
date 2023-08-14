import { useState } from 'react';
import { Button, Field, Paginate } from '@healthcareos/react';
import { PlusIcon } from '@healthcare/icons';
import queryString from 'query-string';
import useSWR from 'swr';

import { ProcedureModel } from '../../../models';
import { usePermissions } from '../../../hooks';
import Skeleton from '../../libs/Skeleton';
import TableRow from './Procedures/TableRow';
import AddForm from './Procedures/Form';

function Procedures() {
  /**
   * state
   */
  const [filters, setFilters] = useState<any>({ page: 0 });

  /**
   * perm
   */
  const [canView, canAdd] = usePermissions('procedure_view', 'procedure_add');

  /**
   * api
   */
  const { data, error, mutate } = useSWR<{
    procedures: ProcedureModel[];
    total: number;
  }>(
    canView &&
      `/procedure?${queryString.stringify({
        ...filters,
        page: (filters?.page || 0) + 1,
        per_page: 10,
      })}`,
    null,
    { dedupingInterval: 1000 * 60 * 15, revalidateOnFocus: false }
  );

  /**
   * variables
   */
  const procedures = data?.procedures || [];

  return (
    <>
      <div className="grid md:flex gap-4 mb-4">
        <Field.Search
          onSearch={(search) =>
            setFilters((filters) => ({ ...filters, search }))
          }
        />

        <div className="ml-auto">
          {canAdd && (
            <AddForm mutate={mutate}>
              {({ proceed }) => (
                <Button onClick={() => proceed()} className="btn-primary">
                  <PlusIcon />
                  <span>Add</span>
                </Button>
              )}
            </AddForm>
          )}
        </div>
      </div>

      <div className="overflow-x-auto mb-8">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Code</th>
              <th>Prices</th>
              <th>Created at</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {!data && !error && <Skeleton.Table count={5} />}
            {data && (
              <>
                {!procedures.length && (
                  <tr>
                    <td colSpan={5}>
                      <p className="text-center">No procedures yet</p>
                    </td>
                  </tr>
                )}

                {procedures.map((procedure, key) => (
                  <TableRow key={key} {...{ procedure, mutate }} />
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
            setPage={(page) => setFilters((filters) => ({ ...filters, page }))}
          />
        </div>
      )}
    </>
  );
}

export default Procedures;
