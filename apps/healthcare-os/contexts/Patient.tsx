import { Dispatch, SetStateAction, createContext, useState } from 'react';

import { PatientModel } from '../models/patient';

export const PatientContext = createContext<{
  patient: Partial<PatientModel>;
  setPatient: Dispatch<SetStateAction<Partial<PatientModel>>>;
}>({
  patient: {},
  setPatient: () => null,
});

const PatientProvider = ({ children }: { children: any }) => {
  /**
   * state
   */
  const [patient, setPatient] = useState<PatientModel>();

  return (
    <PatientContext.Provider value={{ patient: { ...patient }, setPatient }}>
      {children}
    </PatientContext.Provider>
  );
};

export default PatientProvider;
