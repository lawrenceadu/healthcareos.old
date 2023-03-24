import { useState } from 'react';
import { Button, Field } from '@healthcareos/react';
import { PlusIcon } from '@healthcare/icons';
import queryString from 'query-string';
import useSWR from 'swr';

import { ItemIssueModel } from '../../../../models';
import DropdownFilter from '../../../libs/DropdownFilter';
import Skeleton from '../../../libs/Skeleton';
import TableRow from './Requests/TableRow';
import Form from './Requests/Form';

function Requests() {
  /**
   * context
   */
  const [filters, setFilters] = useState<any>({ page: 0 });

  /**
   * api
   */
  const { data, error, mutate } = useSWR<{ issues: ItemIssueModel[] }>(
    `/item/issue?${queryString.stringify(
      { ...filters },
      { skipEmptyString: true, skipNull: true }
    )}`
  );

  /**
   * variables
   */
  const issues = data?.issues || [];

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
            { label: 'Fulfilled', value: 'fulfilled' },
            { label: 'Pending', value: 'pending' },
            { label: 'Rejected', value: 'rejected' },
            { label: 'Returned', value: 'returned' },
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

      <div className="overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th>Requested by</th>
              <th>From</th>
              <th>Recipient</th>
              <th>Status</th>
              <th className="text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {!data && !error && <Skeleton.Table count={5} />}

            {data && (
              <>
                {!issues.length && (
                  <tr>
                    <td colSpan={5}>
                      <p className="text-center">No request yet</p>
                    </td>
                  </tr>
                )}

                {issues.map((issue, key) => (
                  <TableRow key={key} {...{ mutate, issue }} />
                ))}
              </>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default Requests;
