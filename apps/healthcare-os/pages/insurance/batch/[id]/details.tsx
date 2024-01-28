import { useRouter } from 'next/router';
import { Badge } from '@healthcareos/react';
import useSWR from 'swr';
import dayjs from 'dayjs';

import { InsuranceBatchModel, InsuranceClaimModel } from '../../../../models';
import TableRow from '../../../../components/pages/insurance/claims/TableRow';
import Layout from '../../../../components/libs/Layout';

function Details() {
  /**
   * routes
   */
  const router = useRouter();
  const id = router.query.id as string;

  /**
   * api
   */
  const { data, mutate, isLoading } = useSWR<{
    export: InsuranceBatchModel & { claims: InsuranceClaimModel[] };
  }>(`/export/${id}`);

  /**
   * variables
   */
  const batch = data?.export;

  return (
    <Layout title="Batch Details" onBack={() => router.back()}>
      {isLoading && <></>}

      {data && (
        <>
          <div className="p-4 rounded-lg shadow border border-neutral-200 mb-6">
            <p className="text-lg font-semibold mb-4">Details</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: 'Title', value: batch.title },
                { label: 'No of Claims', value: batch.no_claims },
                { label: 'Created by', value: '-' },
                {
                  label: 'Created at',
                  value: dayjs(batch.created_at).format(
                    'MMM, DD YYYY @ hh:mm a'
                  ),
                },
                {
                  label: 'Status',
                  value: (
                    <Badge
                      variant={batch.status === 'open' ? 'pending' : 'success'}
                    >
                      {batch.status}
                    </Badge>
                  ),
                },
              ].map((item, key) => (
                <div key={key}>
                  <p className="text-xs font-medium text-neutral-500">
                    {item.label}
                  </p>
                  {typeof item.value === 'string' ? (
                    <p className="text-sm">{item.value}</p>
                  ) : (
                    item.value
                  )}
                </div>
              ))}
            </div>
          </div>

          <table>
            <thead>
              <th>Patient</th>
              <th>Visit</th>
              <th>Insurance</th>
              <th>Status</th>
              <th>Total</th>
            </thead>
            <tbody>
              <>
                {!batch.claims.length && (
                  <tr>
                    <td colSpan={10}>
                      <p className="text-center">
                        No insurance claims in this batch
                      </p>
                    </td>
                  </tr>
                )}

                {batch.claims.map((claim, key) => (
                  <TableRow key={key} mutate={() => null} {...{ claim }} />
                ))}
              </>
            </tbody>
          </table>
        </>
      )}
    </Layout>
  );
}

export default Details;
