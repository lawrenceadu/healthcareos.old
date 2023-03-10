import { http } from '@healthcare/utils';

export const addPatientService = (payload: object) =>
  http.post<never, any>('/patient', payload);
