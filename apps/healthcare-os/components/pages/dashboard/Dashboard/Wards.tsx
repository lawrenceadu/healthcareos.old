import queryString from 'query-string';
import useSWR from 'swr';

export interface WardsProps {
  dates: string[];
}

export function Wards({ dates }: WardsProps) {
  /**
   * api
   */
  const { data, isLoading } = useSWR<{
    summary: { label: string; value: number }[];
  }>(
    `/report/ward/summary?${queryString.stringify({
      start_date: dates[0],
      end_date: dates[1],
      limit: 10,
    })}`
  );

  return (
    <div className="grid gap-4">
      {isLoading &&
        Array.from({ length: 10 }, (_, i) => (
          <div className="flex justify-between animate-pulse" key={i}>
            <div className="h-3.5 w-12 bg-neutral-200" />
            <div className="h-3.5 w-3.5 bg-neutral-200" />
          </div>
        ))}
      {(data?.summary || []).map((item, key) => (
        <div className="flex justify-between" key={key}>
          <p className="text-muted">{item.label}</p>
          <p className="font-bold">{item.value}</p>
        </div>
      ))}
    </div>
  );
}

export default Wards;
