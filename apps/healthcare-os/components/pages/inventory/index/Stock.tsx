import { useState } from 'react';
import { Button, Field, Paginate } from '@healthcareos/react';
import { PlusIcon } from '@healthcare/icons';
import queryString from 'query-string';
import useSWR from 'swr';

import { ItemStockModel } from '../../../../models';
import Skeleton from '../../../libs/Skeleton';
import TableRow from './Stock/TableRow';
import Form from './Stock/Form';

function Stock() {
  /**
   * state
   */
  const [filters, setFilters] = useState<any>({ page: 0 });

  /**
   * api
   */
  const { data, error, mutate } = useSWR<{
    stocks: ItemStockModel[];
    total: number;
  }>(
    `/item/stock?${queryString.stringify({
      ...filters,
      page: filters?.page + 1,
    })}`,
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
              <th>Supplier</th>
              <th>Location</th>
              <th className="text-right">Items</th>
              <th>Date</th>
              <th>Subtotal</th>
              <th>Discount</th>
              <th>Total</th>
              <th>Status</th>
              <th className="text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {!data && !error && <Skeleton.Table count={9} />}
            {data && (
              <>
                {!stocks.length && (
                  <tr>
                    <td colSpan={9}>
                      <p className="text-center">No stocks available</p>
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

export default Stock;
