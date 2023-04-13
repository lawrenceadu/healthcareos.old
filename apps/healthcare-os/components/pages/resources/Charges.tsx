import { useState } from 'react';
import { Button, Field, Paginate } from '@healthcareos/react';
import { PlusIcon } from '@healthcare/icons';
import queryString from 'query-string';
import useSWR from 'swr';

import { usePermissions } from '../../../hooks';
import { ChargeModel } from '../../../models';
import Skeleton from '../../libs/Skeleton';
import TableRow from './Charges/TableRow';
import AddForm from './Charges/Form';

function Charges() {
  /**
   * state
   */
  const [filters, setFilters] = useState<any>({ page: 0 });

  /**
   * perm
   */
  const [canViewCharge, canAddCharge] = usePermissions(
    'charge_view',
    'charge_add'
  );

  /**
   * api
   */
  const { data, error, mutate } = useSWR<{
    charges: ChargeModel[];
    total: number;
  }>(
    canViewCharge &&
      `/charge?${queryString.stringify({
        ...filters,
        page: filters?.page + 1,
        per_page: 10,
      })}`,
    null,
    { dedupingInterval: 1000 * 60 * 15, revalidateOnFocus: false }
  );

  /**
   * variables
   */
  const charges = data?.charges || [];

  return (
    <>
      <div className="grid md:flex gap-4 mb-4">
        <Field.Search
          onSearch={(search) =>
            setFilters((filters) => ({ ...filters, search }))
          }
        />

        <div className="ml-auto">
          {canAddCharge && (
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
              <th>Type</th>
              <th>Regular price</th>
              <th>NHIS price</th>
              <th>Private insurance price</th>
              <th>Created by</th>
              <th>Created at</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {!data && !error && <Skeleton.Table count={8} />}
            {data && (
              <>
                {!charges.length && (
                  <tr>
                    <td colSpan={8}>
                      <p className="text-center">No charges yet</p>
                    </td>
                  </tr>
                )}

                {charges.map((charge, key) => (
                  <TableRow key={key} {...{ charge, mutate }} />
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

export default Charges;
