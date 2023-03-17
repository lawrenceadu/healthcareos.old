import { useState } from 'react';
import { Field, Paginate } from '@healthcareos/react';
import queryString from 'query-string';
import useSWR from 'swr';

import { InvestigationRequestModel } from '../../models';
import DropdownFilter from '../../components/libs/DropdownFilter';
import Skeleton from '../../components/libs/Skeleton';
import TableRow from '../../components/pages/investigations/TableRow';
import Layout from '../../components/libs/Layout';

function Index() {
  /**
   * state
   */
  const [filters, setFilters] = useState<any>({ page: 0 });

  /**
   * api
   */
  const { data, error, mutate } = useSWR<{
    investigations: InvestigationRequestModel[];
    total: number;
    page: number;
  }>(
    `/investigation/request?${queryString.stringify(
      {
        ...filters,
        per_page: 10,
        page: (filters?.page || 0) + 1,
      },
      { skipEmptyString: true, skipNull: true }
    )}`
  );

  /**
   * variables
   */
  const investigations = data?.investigations || [];

  return (
    <Layout title="Investigations">
      <div className="grid md:flex gap-4 mb-4">
        <Field.Search
          onSearch={(key) =>
            setFilters((filter) => ({ ...filter, search: key }))
          }
        />

        <DropdownFilter
          name="All statuses"
          value={filters?.status}
          options={[
            { label: 'Pending', value: 'pending' },
            { label: 'Submitted', value: 'submitted' },
          ]}
          setValue={(value) =>
            setFilters((filter) => ({ ...filter, status: value }))
          }
        />
      </div>

      <div className="overflow-x-auto mb-8">
        <table>
          <thead>
            <tr>
              <th>Investigation</th>
              <th>Expected Date</th>
              <th>Requested by</th>
              <th>Requested on</th>
              <th>Patient</th>
              <th>Status</th>
              <th className="text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {!data && !error && <Skeleton.Table count={7} />}
            {data && (
              <>
                {!investigations.length && (
                  <tr>
                    <td colSpan={7}>
                      <div className="text-center">
                        <p>No investigation requests</p>
                      </div>
                    </td>
                  </tr>
                )}

                {investigations.map((investigation, key) => (
                  <TableRow key={key} {...{ investigation, mutate }} />
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
            setPage={(page) => setFilters((filter) => ({ ...filter, page }))}
          />
        </div>
      )}
    </Layout>
  );
}

export default Index;
