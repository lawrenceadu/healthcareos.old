import { http } from '@healthcare/utils';

// department
export const addDepartmentService = (payload: object) =>
  http.post<never, any>(`/department`, payload);

export const updateDepartmentService = (payload: object, id: string) =>
  http.patch<never, any>(`/department/${id}`, payload);

export const deleteDepartmentService = (id: string) =>
  http.delete<never, any>(`/department/${id}`);
// end of department

// location
export const addLocationService = (payload: object) =>
  http.post<never, any>(`/location`, payload);

export const updateLocationService = (payload: object, id: string) =>
  http.patch<never, any>(`/location/${id}`, payload);

export const deleteLocationService = (id: string) =>
  http.delete<never, any>(`/location/${id}`);
// end of location

// charge
export const addChargeService = (payload: object) =>
  http.post<never, any>(`/charge`, payload);

export const updateChargeService = (payload: object, id: string) =>
  http.patch<never, any>(`/charge/${id}`, payload);

export const deleteChargeService = (id: string) =>
  http.delete<never, any>(`/charge/${id}`);
// end of charge

// ward
export const addWardService = (payload: object) =>
  http.post<never, any>(`/ward`, payload);

export const updateWardService = (payload: object, id: string) =>
  http.patch<never, any>(`/ward/${id}`, payload);

export const deleteWardService = (id: string) =>
  http.delete<never, any>(`/ward/${id}`);
// end of ward

// diagnosis
export const addDiagnosisService = (payload: object) =>
  http.post<never, any>(`/diagnosis`, payload);

export const updateDiagnosisService = (payload: object, id: string) =>
  http.patch<never, any>(`/diagnosis/${id}`, payload);

export const deleteDiagnosisService = (id: string) =>
  http.delete<never, any>(`/diagnosis/${id}`);
// end of diagnosis

// investigation
export const addInvestigationService = (payload: object) =>
  http.post<never, any>(`/investigation`, payload);

export const updateInvestigationService = (payload: object, id: string) =>
  http.patch<never, any>(`/investigation/${id}`, payload);

export const deleteInvestigationService = (id: string) =>
  http.delete<never, any>(`/investigation/${id}`);
// end of investigation

// supplier
export const addSupplierService = (payload: object) =>
  http.post<never, any>(`/supplier`, payload);

export const updateSupplierService = (payload: object, id: string) =>
  http.patch<never, any>(`/supplier/${id}`, payload);

export const deleteSupplierService = (id: string) =>
  http.delete<never, any>(`/supplier/${id}`);
// end of supplier

// triage
export const addTriageService = (payload: object) =>
  http.post<never, any>(`/triage`, payload);

export const updateTriageService = (payload: object, id: string) =>
  http.patch<never, any>(`/triage/${id}`, payload);

export const deleteTriageService = (id: string) =>
  http.delete<never, any>(`/triage/${id}`);
// end of triage
