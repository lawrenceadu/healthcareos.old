import { useState } from 'react';
import { Button, Field, Paginate } from '@healthcareos/react';
import { PlusIcon } from '@healthcare/icons';
import queryString from 'query-string';
import useSWR from 'swr';

import { ItemModel } from '../../../../models';
import Skeleton from '../../../libs/Skeleton';
import TableRow from './Items/TableRow';
import Form from './Items/Form';

function Items() {
  /**
   * state
   */
  const [filters, setFilters] = useState<any>({ page: 0 });

  /**
   * api
   */
  const { data, error, mutate } = useSWR<{ items: ItemModel[]; total: number }>(
    `/item?${queryString.stringify(
      {
        ...filters,
        page: filters.page + 1,
        per_page: 10,
      },
      { skipEmptyString: true, skipNull: true }
    )}`,
    null,
    { dedupingInterval: 1000 * 60 * 15 }
  );

  /**
   * variables
   */
  const items = data?.items || [];

  return (
    <>
      <div className="grid md:flex gap-4 mb-4">
        <Field.Search
          onSearch={(search) =>
            setFilters((filters) => ({ ...filters, search }))
          }
        />

        <div className="ml-auto">
          <Form mutate={mutate}>
            {({ proceed }) => (
              <Button className="btn-primary !px-4" onClick={() => proceed()}>
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
              <th>Name</th>
              <th>Code</th>
              <th>Category</th>
              <th>Group</th>
              <th>Unit</th>
              <th className="text-right">Quantity</th>
              <th className="text-right">Minimum Level</th>
              <th className="text-right">Reorder Level</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {!data && !error && <Skeleton.Table count={8} />}

            {data && (
              <>
                {!items.length && (
                  <tr>
                    <td colSpan={8}>
                      <p className="text-center">No items yet</p>
                    </td>
                  </tr>
                )}

                {items.map((item, key) => (
                  <TableRow key={key} {...{ item, mutate }} />
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

export default Items;
