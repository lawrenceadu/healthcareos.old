import useSWR from 'swr/immutable';

import { CountryModel } from '../models';

function useCountries() {
  /**
   * api
   */
  const { data } = useSWR<{
    countries: CountryModel[];
  }>(`/geolocation/country`);

  return data?.countries || [];
}

export default useCountries;
