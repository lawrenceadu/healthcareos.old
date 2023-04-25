import { useState } from 'react';
import { Button, Field, Paginate } from '@healthcareos/react';
import { PlusIcon } from '@healthcare/icons';
import queryString from 'query-string';
import useSWR from 'swr';

import { usePermissions } from '../../../hooks';
import { SupplierModel } from '../../../models';
import Skeleton from '../../libs/Skeleton';
import TableRow from './Suppliers/TableRow';
import AddForm from './Suppliers/Form';

function Suppliers() {
  /**
   * state
   */
  const [filters, setFilters] = useState<any>({ page: 0 });

  /**
   * perm
   */
  const [canView, canAdd] = usePermissions('supplier_view', 'supplier_add');

  /**
   * api
   */
  const { data, error, mutate } = useSWR<{
    suppliers: SupplierModel[];
    total: number;
  }>(
    canView &&
      `/supplier?${queryString.stringify({
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
  const suppliers = data?.suppliers || [];

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
              <th>Phone</th>
              <th>Email</th>
              <th>Address</th>
              <th>Created at</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {!data && !error && <Skeleton.Table count={6} />}
            {data && (
              <>
                {!suppliers.length && (
                  <tr>
                    <td colSpan={6}>
                      <p className="text-center">No suppliers yet</p>
                    </td>
                  </tr>
                )}

                {suppliers.map((supplier, key) => (
                  <TableRow key={key} {...{ supplier, mutate }} />
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

export default Suppliers;
