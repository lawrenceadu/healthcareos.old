import { useState } from 'react';
import { Button, Field, Paginate } from '@healthcareos/react';
import { PlusIcon } from '@healthcare/icons';
import queryString from 'query-string';
import useSWR from 'swr';

import { DiagnosisModel } from '../../../models';
import Skeleton from '../../libs/Skeleton';
import TableRow from './Diagnoses/TableRow';
import AddForm from './Diagnoses/Form';

function Diagnoses() {
  /**
   * state
   */
  const [filters, setFilters] = useState<any>({ page: 0 });

  /**
   * api
   */
  const { data, error, mutate } = useSWR<{
    diagnoses: DiagnosisModel[];
    total: number;
  }>(
    `/diagnosis?${queryString.stringify({
      ...filters,
      page: filters?.page + 1,
      per_page: 10,
    })}`
  );

  /**
   * variables
   */
  const diagnoses = data?.diagnoses || [];

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
              <th>Created at</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {!data && !error && <Skeleton.Table count={4} />}
            {data && (
              <>
                {!diagnoses.length && (
                  <tr>
                    <td colSpan={4}>
                      <p className="text-center">No diagnoses yet</p>
                    </td>
                  </tr>
                )}

                {diagnoses.map((diagnosis, key) => (
                  <TableRow key={key} {...{ diagnosis, mutate }} />
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

export default Diagnoses;
