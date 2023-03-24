import { useState } from 'react';
import { Button, Field, Paginate } from '@healthcareos/react';
import { PlusIcon } from '@healthcare/icons';
import queryString from 'query-string';
import useSWR from 'swr';

import { MedicineModel } from '../../../../models';
import Skeleton from '../../../libs/Skeleton';
import TableRow from './Medicines/TableRow';
import Form from './Medicines/Form';

function Items() {
  /**
   * state
   */
  const [filters, setFilters] = useState<any>({ page: 0 });

  /**
   * api
   */
  const { data, error, mutate } = useSWR<{
    medicines: MedicineModel[];
    total: number;
  }>(
    `/medicine?${queryString.stringify(
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
  const medicines = data?.medicines || [];

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
              <th className="text-right">Minimum Level</th>
              <th className="text-right">Reorder Level</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {!data && !error && <Skeleton.Table count={8} />}

            {data && (
              <>
                {!medicines.length && (
                  <tr>
                    <td colSpan={8}>
                      <p className="text-center">No medicines yet</p>
                    </td>
                  </tr>
                )}

                {medicines.map((medicine, key) => (
                  <TableRow key={key} {...{ medicine, mutate }} />
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
