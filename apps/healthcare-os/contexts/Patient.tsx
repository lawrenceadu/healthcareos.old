import { Dispatch, SetStateAction, createContext, useEffect, useState } from 'react'; // prettier-ignore

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
  const [patient, setPatient] = useState<Partial<PatientModel>>();

  /**
   * effect
   */
  useEffect(() => {
    if (patient) {
      window.localStorage.setItem(
        `${process.env['NX_STORAGE_KEY']}.patient`,
        JSON.stringify(patient)
      );
    }
  }, [patient]);

  useEffect(() => {
    const pt = window.localStorage.getItem(
      `${process.env['NX_STORAGE_KEY']}.patient`
    );

    if (pt) {
      const patient = JSON.parse(pt);
      setPatient(patient);
    }
  }, []);

  return (
    <PatientContext.Provider value={{ patient: { ...patient }, setPatient }}>
      {children}
    </PatientContext.Provider>
  );
};

export default PatientProvider;
