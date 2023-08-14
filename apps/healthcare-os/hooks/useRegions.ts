import useSWR from 'swr/immutable';

import { RegionModel } from '../models';
import useStore from './useStore';

function useRegions(): RegionModel[] {
  /**
   * store
   */
  const { store } = useStore();

  const { data } = useSWR<{ regions: RegionModel[] }>(
    `/geolocation/region?country=${store.facility.country.id}`
  );

  return data?.regions || [];
}

export default useRegions;
