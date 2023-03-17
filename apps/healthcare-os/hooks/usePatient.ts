import useSWR, { useSWRConfig } from 'swr';
import { useRouter } from 'next/router';

import { PatientModel } from '../models';

function usePatient(id?: string) {
  /**
   * routes
   */
  const router = useRouter();
  const patientId = router.query.id;

  /**
   * api
   */
  const { mutate } = useSWRConfig();
  const swr = useSWR<{ patient: PatientModel }>(
    `/patient/${id || patientId}`,
    null,
    {
      refreshInterval: 1000 * 60 * 5,
      dedupingInterval: 1000 * 60 * 1,
    }
  );

  /**
   * function
   */
  const updateHistory = () =>
    mutate(`/visit?patient=${swr?.data?.patient?.id}`);

  return { ...swr, patient: swr?.data?.patient, updateHistory };
}

export default usePatient;
