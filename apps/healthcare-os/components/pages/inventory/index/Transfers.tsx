import { useState } from 'react';
import { Button, Field, Paginate } from '@healthcareos/react';
import { PlusIcon } from '@healthcare/icons';
import queryString from 'query-string';
import useSWR from 'swr';

import { ItemTransferModel } from '../../../../models';
import DropdownFilter from '../../../libs/DropdownFilter';
import Skeleton from '../../../libs/Skeleton';
import TableRow from './Transfers/TableRow';
import Form from './Transfers/Form';

function Transfers() {
  /**
   * context
   */
  const [filters, setFilters] = useState<any>({ page: 0 });

  /**
   * api
   */
  const { data, error, mutate } = useSWR<{
    transfers: ItemTransferModel[];
    total: number;
  }>(
    `/item/transfer?${queryString.stringify(
      { ...filters, per_page: 10, page: (filters?.page || 0) + 1 },
      { skipEmptyString: true, skipNull: true }
    )}`
  );

  /**
   * variables
   */
  const transfers = data?.transfers || [];

  return (
    <>
      <div className="grid md:flex items-center gap-4 mb-4">
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

        <Form {...{ mutate }}>
          {({ proceed }) => (
            <Button
              onClick={() => proceed()}
              className="lg:ml-auto btn-primary"
            >
              <PlusIcon />
              <span>Add</span>
            </Button>
          )}
        </Form>
      </div>

      <div className="overflow-x-auto mb-8">
        <table>
          <thead>
            <tr>
              <th>Transfer by</th>
              <th>From</th>
              <th>To</th>
              <th className="text-right">Items</th>
              <th>Created at</th>
              <th>Status</th>
              <th className="text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {!data && !error && <Skeleton.Table count={7} />}

            {data && (
              <>
                {!transfers.length && (
                  <tr>
                    <td colSpan={7}>
                      <p className="text-center">No transfers yet</p>
                    </td>
                  </tr>
                )}

                {transfers.map((transfer, key) => (
                  <TableRow key={key} {...{ mutate, transfer }} />
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

export default Transfers;
