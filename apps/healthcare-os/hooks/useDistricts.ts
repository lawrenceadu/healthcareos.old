import useSWR from 'swr';

function useDistricts(regionId?: string) {
  /**
   * api
   */
  const { data } = useSWR<{ districts: { id: string; name: string }[] }>(
    regionId && `/location/district?region=${regionId}`
  );

  return data?.districts || [];
}

export default useDistricts;
