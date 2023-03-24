import { http } from '@healthcare/utils';

export const admitPatientService = (payload: object) =>
  http.post<never, any>(`/admission`, payload);

export const dischargePatientService = (payload: object) =>
  http.post<never, any>(`/admission/discharge`, payload);
