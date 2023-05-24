import { http } from '@healthcare/utils';

// patient
export const addPatientService = (payload: object) =>
  http.post<never, any>('/patient', payload);

export const updatePatientService = (payload: object, id: string) =>
  http.patch<never, any>(`/patient/${id}`, payload);
// end of patient

// visit
export const startVisitationService = (payload: object) =>
  http.post<never, any>('/visit', payload);

export const endVisitationService = (id: string) =>
  http.post<never, any>(`/visit/end`, { patient: id });
// end of visit

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

// invoice
export const createPatientInvoiceService = (payload: object) =>
  http.post<never, any>(`/invoice`, payload);

export const updatePatientInvoiceService = (payload: object, id: string) =>
  http.patch<never, any>(`/invoice/${id}`, payload);

export const finalizePatientInvoiceService = (payload: object, id: string) =>
  http.post(`/invoice/${id}`, payload);

export const deletePatientInvoiceService = (id: string) =>
  http.delete(`/invoice/${id}`);
// end of invoice

// notes
export const createPatientNotesService = (payload: object) =>
  http.post<never, any>(`/note`, payload);

export const updatePatientNotesService = (payload: object, id: string) =>
  http.post<never, any>(`/note/`, payload);
// end of notes

// drug chart
export const administerDrugService = (payload: object) =>
  http.post<never, any>(`/prescription/administration`, payload);
// end of drug chart
