import { useState } from 'react';
import { Button, Field, Paginate } from '@healthcareos/react';
import { PlusIcon } from '@healthcare/icons';
import { helpers } from '@healthcare/utils';
import queryString from 'query-string';
import useSWR from 'swr';

import { InstitutionModel } from '../../../models/institution';
import TableRow from './Institutions/TableRow';
import Skeleton from '../../libs/Skeleton';
import Form from './Institutions/Form';

function Institutions() {
  /**
   * state
   */
  const [filters, setFilters] = useState<any>({ page: 0 });

  /**
   * state
   */
  const { data, mutate, isLoading } = useSWR<{
    institutions: InstitutionModel[];
    total: number;
  }>(
    `/institution?${queryString.stringify({
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
  const institutions = data?.institutions || [];

  return (
    <>
      <div
        className={helpers.classNames(
          'grid gap-4 md:flex md:justify-between',
          'mb-4'
        )}
      >
        <Field.Search onSearch={() => null} />

        <div>
          <Form mutate={mutate}>
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
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Address</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && <Skeleton.Table count={5} />}{' '}
            {data && (
              <>
                {!institutions.length && (
                  <tr>
                    <td colSpan={5}>
                      <p className="text-center">No institutions added yet</p>
                    </td>
                  </tr>
                )}

                {institutions.map((institution, key) => (
                  <TableRow key={key} {...{ institution, mutate }} />
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

export default Institutions;
