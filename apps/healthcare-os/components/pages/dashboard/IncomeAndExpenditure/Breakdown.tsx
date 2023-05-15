import { useState } from 'react';
import { Paginate } from '@healthcareos/react';
import queryString from 'query-string';
import useSWR from 'swr';

import Skeleton from '../../../libs/Skeleton';

function Breakdown({ slug, dates }: { slug: string; dates: string[] }) {
  /**
   * state
   */
  const [page, setPage] = useState(0);

  /**
   * api
   */
  const { data, isLoading } = useSWR<{
    summary: { breakdown: { label: string; value: number }[]; total: number };
  }>(
    `/report/finance/${slug}?${queryString.stringify({
      page: page + 1,
      start_date: dates[0],
      end_date: dates[1],
    })}`
  );

  const { breakdown = [], total } = data?.summary || {};

  return (
    <div>
      {/* <div className="mb-6 flex justify-between">
        <Button className="btn-primary ml-auto">Download report</Button>
      </div> */}

      <div className="overflow-x-auto mb-8">
        <table>
          <thead>
            <tr>
              <th>Source</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && <Skeleton.Table count={2} />}
            {data && (
              <>
                {!breakdown?.length && (
                  <tr>
                    <td colSpan={2} className="text-center">
                      <div className="py-4">
                        <p>No data</p>
                      </div>
                    </td>
                  </tr>
                )}

                {breakdown?.map((summary, key) => (
                  <tr key={key}>
                    <td>{summary?.label}</td>
                    <td>Ghs {summary?.value}</td>
                  </tr>
                ))}
              </>
            )}
          </tbody>
        </table>
      </div>
      {!!total && (
        <div className="flex justify-end">
          <Paginate pageCount={Math.ceil(total / 10)} {...{ page, setPage }} />
        </div>
      )}
    </div>
  );
}

export default Breakdown;
