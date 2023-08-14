import useSWR from 'swr/immutable';

import { CountryModel } from '../models';

function useCountries(): CountryModel[] {
  /**
   * api
   */
  const { data } = useSWR<{
    countries: CountryModel[];
  }>(`/geolocation/country`);

  return data?.countries || [];
}

export default useCountries;
