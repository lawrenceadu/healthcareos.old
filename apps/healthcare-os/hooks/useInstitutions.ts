import useSWR from 'swr/immutable';

import { InstitutionModel } from '../models';

function useInstitutions(): InstitutionModel[] {
  /**
   * api
   */
  const { data } = useSWR<{ institutions: InstitutionModel[] }>(
    `/institution?per_page=1000`
  );

  return data?.institutions || [];
}

export default useInstitutions;
