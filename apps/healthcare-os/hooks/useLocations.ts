import useSWR from 'swr/immutable';

import { LocationModel } from '../models';

function useLocations() {
  /**
   * api
   */
  const { data } = useSWR<{ locations: LocationModel[] }>(`/location`);

  return data?.locations || [];
}

export default useLocations;
