import useSWR from 'swr';

import useStore from './useStore';

function useRegions() {
  /**
   * store
   */
  const { store } = useStore();

  const { data } = useSWR<{ regions: { id: string; name: string }[] }>(
    `/location/region?country=${store.facility.country.id}`
  );

  return data?.regions || [];
}

export default useRegions;
