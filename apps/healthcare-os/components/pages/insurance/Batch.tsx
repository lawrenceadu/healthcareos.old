import { Button, Field, Paginate } from '@healthcareos/react';
import { useSession } from '@healthcare/utils';
import queryString from 'query-string';
import useSWR from 'swr';

import { InsuranceBatchModel } from '../../../models';
// import { usePermissions } from '../../../hooks';

import Skeleton from '../../libs/Skeleton';
import TableRow from './batch/TableRow';
import Create from './batch/Create';

function Batch() {
  /**
   * state
   */
  const [filters, setFilters] = useSession<any>('insurance-batch');

  /**
   * perm
   */
  const [canView] = [true];

  /**
   * api
   */
  const { data, mutate, isLoading } = useSWR<{
    exports: InsuranceBatchModel[];
    total: number;
  }>(
    canView &&
      `/export?${queryString.stringify({
        limit: 10,
        page: 0,
        ...filters,
      })}`
  );

  /**
   * variables
   */
  const exports = data?.exports || [];

  return (
    <>
      {canView && (
        <>
          <div className="mb-6 flex items-center justify-between gap-4">
            <Field.Search
              value={filters?.search}
              onSearch={(search) => {
                setFilters({ ...filters, search });
              }}
            />
            <Create onSuccess={() => mutate()}>
              {({ proceed }) => (
                <Button onClick={() => proceed()} className="btn btn-primary">
                  Create Batch
                </Button>
              )}
            </Create>
          </div>

          <div className="overflow-x-auto mb-8">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th className="text-right">No of Claims</th>
                  <th>Status</th>
                  <th>Created By</th>
                  <th>Created at</th>
                  <th>File</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {isLoading && <Skeleton.Table count={7} />}

                {data && (
                  <>
                    {!exports.length && (
                      <tr>
                        <td colSpan={10}>
                          <p className="text-center">No batches created yet</p>
                        </td>
                      </tr>
                    )}
                    {exports.map((batch, key) => (
                      <TableRow key={key} {...{ mutate, batch }} />
                    ))}
                  </>
                )}
              </tbody>
            </table>
          </div>

          {data && (
            <div className="flex justify-end">
              <Paginate
                page={filters?.page || 0}
                pageCount={Math.ceil(data?.total / 10)}
                setPage={(page) => setFilters({ ...filters, page })}
              />
            </div>
          )}
        </>
      )}
    </>
  );
}

export default Batch;
