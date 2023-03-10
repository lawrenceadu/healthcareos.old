import { useContext } from 'react';
import useSWR from 'swr';

import { PatientContext } from './../contexts/Patient';
import { PatientModel } from '../models';

function usePatient(id: string) {
  /**
   * context
   */
  const { setPatient } = useContext(PatientContext);

  /**
   * api
   */
  const swr = useSWR<{ patient: PatientModel }>(`/patient/${id}`, null, {
    onSuccess: ({ patient }: { patient: PatientModel }) => {
      setPatient(patient);
    },
  });

  return swr;
}

export default usePatient;
