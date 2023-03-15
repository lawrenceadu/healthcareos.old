import { useRouter } from 'next/router';
import { useContext } from 'react';
import useSWR, { useSWRConfig } from 'swr';

import { PatientContext } from './../contexts/Patient';
import { PatientModel } from '../models';

function usePatient(id?: string) {
  /**
   * context
   */
  const { setPatient } = useContext(PatientContext);

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
      onSuccess: ({ patient }: { patient: PatientModel }) => {
        setPatient(patient);
      },
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
