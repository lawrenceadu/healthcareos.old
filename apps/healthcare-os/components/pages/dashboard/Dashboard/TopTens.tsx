import queryString from 'query-string';
import useSWR from 'swr';

export interface TopTensProps {
  slug: string;
  dates: string[];
}

export function TopTens({ slug, dates }: TopTensProps) {
  /**
   * api
   */
  const { data, isLoading } = useSWR<{
    summary: { label: string; value: number }[];
  }>(
    `/report/${slug}/summary?${queryString.stringify({
      start_date: dates[0],
      end_date: dates[1],
      limit: 10,
    })}`
  );

  return (
    <div className="min-h-[400px]">
      {isLoading &&
        Array.from({ length: 10 }, (_, i) => (
          <div className="flex justify-between animate-pulse mb-4" key={i}>
            <div className="h-3.5 w-12 bg-neutral-200" />
            <div className="h-3.5 w-3.5 bg-neutral-200" />
          </div>
        ))}

      {(data?.summary || []).map((item, key) => (
        <div className="flex justify-between mb-4" key={key}>
          <p className="text-muted">{item.label}</p>
          <p className="font-bold">{item.value}</p>
        </div>
      ))}

      {!isLoading && !data?.summary?.length && (
        <div className="py-6 text-center">
          <p className="text-muted">No data found</p>
        </div>
      )}
    </div>
  );
}

export default TopTens;
