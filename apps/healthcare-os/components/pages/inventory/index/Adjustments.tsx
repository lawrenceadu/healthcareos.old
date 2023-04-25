import { useState } from 'react';
import { Button, Field, Paginate } from '@healthcareos/react';
import { PlusIcon } from '@healthcare/icons';
import queryString from 'query-string';
import useSWR from 'swr';

import { ItemAdjustmentModel } from '../../../../models';
import DropdownFilter from '../../../libs/DropdownFilter';
import Skeleton from '../../../libs/Skeleton';
import TableRow from './Adjustments/TableRow';
import Form from './Adjustments/Form';

function Adjustments() {
  /**
   * state
   */
  const [filters, setFilters] = useState<any>({ page: 0 });

  /**
   * api
   */
  const { data, error, mutate } = useSWR<{
    stocks: ItemAdjustmentModel[];
    total: number;
  }>(
    `/item/stock?${queryString.stringify(
      {
        ...filters,
        per_page: 10,
        page: (filters?.page || 0) + 1,
      },
      { skipEmptyString: true, skipNull: true }
    )}`,
    null,
    { dedupingInterval: 1000 * 60 * 15 }
  );

  /**
   * variables
   */
  const stocks = data?.stocks || [];

  return (
    <>
      <div className="grid md:flex gap-4 mb-4">
        <Field.Search
          onSearch={(search) =>
            setFilters((filters) => ({ ...filters, search }))
          }
        />

        <DropdownFilter
          name="All statuses"
          value={filters?.status}
          options={[
            { label: 'Approved', value: 'approved' },
            { label: 'Pending', value: 'pending' },
            { label: 'Rejected', value: 'rejected' },
          ]}
          setValue={(status) =>
            setFilters((filters) => ({ ...filters, status }))
          }
        />

        <div className="ml-auto">
          <Form {...{ mutate }}>
            {({ proceed }) => (
              <Button onClick={() => proceed()} className="btn-primary">
                <PlusIcon />
                <span>Add</span>
              </Button>
            )}
          </Form>
        </div>
      </div>

      <div className="overflow-x-auto mb-8">
        <table>
          <thead>
            <tr>
              <th>Reference</th>
              <th>Location</th>
              <th className="text-right">Items</th>
              <th>Date</th>
              <th>Status</th>
              <th>Reason</th>
              <th>Adjusted by</th>
              <th className="text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {!data && !error && <Skeleton.Table count={8} />}
            {data && (
              <>
                {!stocks.length && (
                  <tr>
                    <td colSpan={8}>
                      <p className="text-center">No adjustments yet</p>
                    </td>
                  </tr>
                )}

                {stocks.map((stock, key) => (
                  <TableRow key={key} {...{ stock, mutate }} />
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

export default Adjustments;
