import { useState } from 'react';
import { Button, Field, Paginate } from '@healthcareos/react';
import { PlusIcon } from '@healthcare/icons';
import queryString from 'query-string';
import useSWR from 'swr';

import { WardModel } from '../../../models';
import Skeleton from '../../libs/Skeleton';
import TableRow from './Wards/TableRow';
import AddForm from './Wards/Form';

function Wards() {
  /**
   * state
   */
  const [filters, setFilters] = useState<any>({ page: 0 });

  /**
   * api
   */
  const { data, error, mutate } = useSWR<{
    wards: WardModel[];
    total: number;
  }>(
    `/ward?${queryString.stringify({
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
  const wards = data?.wards || [];

  return (
    <>
      <div className="grid md:flex gap-4 mb-4">
        <Field.Search
          onSearch={(search) =>
            setFilters((filters) => ({ ...filters, search }))
          }
        />

        <div className="ml-auto">
          <AddForm mutate={mutate}>
            {({ proceed }) => (
              <Button onClick={() => proceed()} className="btn-primary">
                <PlusIcon />
                <span>Add</span>
              </Button>
            )}
          </AddForm>
        </div>
      </div>

      <div className="overflow-x-auto mb-8">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th className="text-right">Capacity</th>
              <th className="text-right">Available</th>
              <th>Rate per day/night</th>
              <th>Created by</th>
              <th>Created at</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {!data && !error && <Skeleton.Table count={8} />}
            {data && (
              <>
                {!wards.length && (
                  <tr>
                    <td colSpan={8}>
                      <p className="text-center">No wards yet</p>
                    </td>
                  </tr>
                )}

                {wards.map((ward, key) => (
                  <TableRow key={key} {...{ ward, mutate }} />
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

export default Wards;
