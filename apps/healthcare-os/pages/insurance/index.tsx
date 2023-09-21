import { Field, Paginate } from '@healthcareos/react';
import { useSession } from '@healthcare/utils';
import queryString from 'query-string';
import useSWR from 'swr';

import { InsuranceClaimModel } from '../../models';
import { usePermissions } from '../../hooks';
import Skeleton from '../../components/libs/Skeleton';
import TableRow from '../../components/pages/insurance/TableRow';
import Layout from '../../components/libs/Layout';

function Index() {
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
      `/insurance?${queryString.stringify({
        ...filters,
      })}`
  );

  /**
   * variables
   */
  const claims = data?.claims || [];

  return (
    <Layout title="Insurance claims">
      {canView && (
        <>
          <div className="mb-6 flex">
            <Field.Search
              value={filters?.search}
              onSearch={(search) => {
                setFilters({ ...filters, search });
              }}
            />
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

          {/* {data && ( */}
          <div className="flex justify-end">
            <Paginate
              page={filters?.page || 0}
              pageCount={Math.ceil(data?.total || 10 / 10)}
              setPage={(page) => setFilters({ ...filters, page })}
            />
          </div>
          {/* )} */}
        </>
      )}
    </Layout>
  );
}

export default Index;
