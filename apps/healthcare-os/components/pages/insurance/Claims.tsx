import { Field, Paginate } from '@healthcareos/react';
import { useSession } from '@healthcare/utils';
import queryString from 'query-string';
import useSWR from 'swr';

import { InsuranceClaimModel } from '../../../models';
import { usePermissions } from '../../../hooks';

import Skeleton from '../../libs/Skeleton';
import TableRow from './claims/TableRow';

function Claims() {
  /**
   * state
   */
  const [filters, setFilters] = useSession<any>('insurance');

  /**
   * perm
   */
  const [canView] = usePermissions('insuranceclaim_view');

  /**
   * api
   */
  const { data, mutate, isLoading } = useSWR<{
    claims: InsuranceClaimModel[];
    total: number;
  }>(
    canView &&
      `/insurance/claim?${queryString.stringify({
        limit: 10,
        page: 0,
        ...filters,
      })}`
  );

  /**
   * variables
   */
  const claims = data?.claims || [];

  return (
    <>
      {canView && (
        <>
          <div className="mb-6 flex gap-3 items-center">
            <Field.Search
              value={filters?.search}
              onSearch={(search) => {
                setFilters({ ...filters, search });
              }}
            />
            <Field.Group
              withFormik={false}
              name="date"
              className="shrink-0 w-80"
            >
              <Field.Date
                name="from"
                placeholder="Filter by date"
                options={{ mode: 'range' }}
                value={
                  [filters?.start_date, filters?.end_date].filter(Boolean) ||
                  null
                }
                setFieldValue={(_, date) => {
                  setFilters((f) => ({
                    ...f,
                    start_date: date[0],
                    end_date: date[1],
                  }));
                }}
              />
            </Field.Group>
          </div>

          <div className="overflow-x-auto mb-8">
            <table>
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Visit</th>
                  <th>Insurance</th>
                  <th>Status</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {isLoading && <Skeleton.Table count={5} />}

                {data && (
                  <>
                    {!claims.length && (
                      <tr>
                        <td colSpan={10}>
                          <p className="text-center">No insurance claims yet</p>
                        </td>
                      </tr>
                    )}

                    {claims.map((claim, key) => (
                      <TableRow key={key} {...{ claim, mutate }} />
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

export default Claims;
