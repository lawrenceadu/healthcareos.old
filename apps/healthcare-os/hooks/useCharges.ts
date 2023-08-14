import useSWR from 'swr/immutable';

import { ChargeModel } from '../models';

function useCharges(): ChargeModel[] {
  /**
   * api
   */
  const { data } = useSWR<{ charges: ChargeModel[] }>(`/charge`);

  return data?.charges || [];
}

export default useCharges;
