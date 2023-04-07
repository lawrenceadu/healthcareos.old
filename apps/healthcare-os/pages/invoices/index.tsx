import { useState } from 'react';
import { Field, Paginate } from '@healthcareos/react';
import queryString from 'query-string';
import useSWR from 'swr';

import { InvoiceModel } from '../../models';
import Skeleton from '../../components/libs/Skeleton';
import TableRow from '../../components/pages/invoices/TableRow';
import Layout from '../../components/libs/Layout';

function Index() {
  /**
   * state
   */
  const [filters, setFilters] = useState<any>({ page: 0 });

  /**
   * api
   */
  const { data, mutate, isLoading } = useSWR<{
    invoices: InvoiceModel[];
    total: number;
  }>(
    `/invoice?${queryString.stringify({
      ...filters,
      page: (filters?.page || 0) + 1,
      per_page: 10,
    })}`
  );

  /**
   * variables
   */
  const invoices = data?.invoices || [];

  return (
    <Layout title="Invoices">
      <div className="mb-6 flex">
        <Field.Search
          onSearch={(search) =>
            setFilters((filters) => ({ ...filters, search }))
          }
        />
      </div>

      <div className="overflow-x-auto mb-8">
        <table>
          <thead>
            <tr>
              <th>Reference</th>
              <th>Patient</th>
              <th className="text-right">Items</th>
              <th>Added by</th>
              <th>Added On</th>
              <th>Status</th>
              <th>Subtotal</th>
              <th>Discount</th>
              <th>Total</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && <Skeleton.Table count={8} />}

            {data && (
              <>
                {!invoices.length && (
                  <tr>
                    <td colSpan={10}>
                      <p className="text-center">No invoices yet</p>
                    </td>
                  </tr>
                )}

                {invoices.map((invoice, key) => (
                  <TableRow key={key} {...{ invoice, mutate }} />
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
    </Layout>
  );
}

export default Index;
