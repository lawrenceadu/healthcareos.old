import { useContext } from 'react';

import { PatientContext } from '../contexts/Patient';

function usePatient() {
  /**
   * context
   */
  const { patient, setPatient } = useContext(PatientContext);

  return { patient, setPatient };
}

export default usePatient;
