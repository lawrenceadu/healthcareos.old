import { useState } from 'react';
import { Button, Field, Paginate } from '@healthcareos/react';
import { PlusIcon } from '@healthcare/icons';
import queryString from 'query-string';
import useSWR from 'swr';

import { MedicineCategoryModel } from '../../../../models';
import { usePermissions } from '../../../../hooks';
import Skeleton from '../../../libs/Skeleton';
import TableRow from './Category/TableRow';
import Form from './Category/Form';

function Category() {
  /**
   * state
   */
  const [filters, setFilters] = useState<any>({ page: 0 });

  /**
   * perm
   */
  const [canView, canAdd] = usePermissions(
    'medicinecategory_view',
    'medicinecategory_add'
  );

  /**
   * api
   */
  const { data, error, mutate } = useSWR<{
    categories: MedicineCategoryModel[];
    total: number;
  }>(
    canView &&
      `/medicine/category?${queryString.stringify(
        { ...filters, page: (filters?.page || 0) + 1, per_page: 10 },
        { skipEmptyString: true, skipNull: true }
      )}`,
    null,
    { dedupingInterval: 1000 * 60 * 15 }
  );

  /**
   * variables
   */
  const categories = data?.categories || [];

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
            <Form mutate={mutate}>
              {({ proceed }) => (
                <Button className="btn-primary !px-4" onClick={() => proceed()}>
                  <PlusIcon />
                  <span>Add</span>
                </Button>
              )}
            </Form>
          )}
        </div>
      </div>

      <div className="overflow-x-auto mb-8">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Code</th>
              <th>Description</th>
              <th className="text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {!data && !error && <Skeleton.Table count={7} />}

            {data && (
              <>
                {!categories.length && (
                  <tr>
                    <td colSpan={4}>
                      <p className="text-center">No categories yet</p>
                    </td>
                  </tr>
                )}

                {categories.map((category, key) => (
                  <TableRow key={key} {...{ category, mutate }} />
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

export default Category;
