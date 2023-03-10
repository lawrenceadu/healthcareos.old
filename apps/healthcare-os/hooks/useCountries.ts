import useSWR from 'swr';

function useCountries() {
  /**
   * api
   */
  const { data } = useSWR<{
    countries: { id: string; code: string; name: string }[];
  }>(`/location/country`);

  return data?.countries || [];
}

export default useCountries;
