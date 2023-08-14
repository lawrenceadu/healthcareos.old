import useSWR from 'swr/immutable';

import { DistrictModel } from '../models';

function useDistricts(regionId?: string): DistrictModel[] {
  /**
   * api
   */
  const { data } = useSWR<{ districts: DistrictModel[] }>(
    regionId && `/geolocation/district?region=${regionId}`
  );

  return data?.districts || [];
}

export default useDistricts;
