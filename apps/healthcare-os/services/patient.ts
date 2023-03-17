import { http } from '@healthcare/utils';

export const addPatientService = (payload: object) =>
  http.post<never, any>('/patient', payload);

export const startVisitationService = (payload: object) =>
  http.post<never, any>('/visit', payload);

// vitals
export const createVitalsService = (payload: object) =>
  http.post<never, any>('/vital', payload);

export const updateVitalsService = (payload: object, id: string) =>
  http.patch<never, any>(`/vital/${id}`, payload);

export const deleteVitalsService = (id: string) =>
  http.delete<never, any>(`/vital/${id}`);
// end of vitals

// consultations
export const createConsultationService = (payload: object) =>
  http.post<never, any>('/consultation', payload);

export const updateConsultationService = (payload: object, id: string) =>
  http.patch<never, any>(`/consultation/${id}`, payload);

export const deleteConsultationService = (id: string) =>
  http.delete<never, any>(`/consultation/${id}`);
// end of consultations

// allergies
export const addAllergyService = (payload: object) =>
  http.post<never, any>(`/allergy`, payload);

export const deleteAllergyService = (id: string) =>
  http.delete<never, any>(`/allergy/${id}`);
// end of allergies

// queue
export const addToQueueService = (payload: object) =>
  http.post<never, any>('/queue', payload);

// investigation
export const requestInvestigationService = (payload: object) =>
  http.post<never, any>('/investigation/request', payload);

// triage
export const setPatientTriageService = (payload: object) =>
  http.post<never, any>('/visit/triage', payload);
