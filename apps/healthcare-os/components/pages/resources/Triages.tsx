import { useState } from 'react';
import { Button, Field, Paginate } from '@healthcareos/react';
import { PlusIcon } from '@healthcare/icons';
import queryString from 'query-string';
import useSWR from 'swr';

import { TriageModel } from '../../../models';
import Skeleton from '../../libs/Skeleton';
import TableRow from './Triages/TableRow';
import AddForm from './Triages/Form';

function Triages() {
  /**
   * state
   */
  const [filters, setFilters] = useState<any>({ page: 0 });

  /**
   * api
   */
  const { data, error, mutate } = useSWR<{
    triages: TriageModel[];
    total: number;
  }>(
    `/triage?${queryString.stringify({
      ...filters,
      page: filters?.page + 1,
      per_page: 10,
    })}`
  );

  /**
   * variables
   */
  const triages = data?.triages || [];

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
              <th>Code</th>
              <th>Color</th>
              <th>Description</th>
              <th>Created at</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {!data && !error && <Skeleton.Table count={5} />}
            {data && (
              <>
                {!triages.length && (
                  <tr>
                    <td colSpan={5}>
                      <p className="text-center">No triages yet</p>
                    </td>
                  </tr>
                )}

                {triages.map((triage, key) => (
                  <TableRow key={key} {...{ triage, mutate }} />
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

export default Triages;
