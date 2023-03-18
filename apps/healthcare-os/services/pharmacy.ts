import { http } from '@healthcare/utils';

// medicine category
export const createMedicineCategoryService = (payload: object) =>
  http.post<never, any>(`/medicine/category`, payload);

export const updateMedicineCategoryService = (payload: object, id: string) =>
  http.patch<never, any>(`/medicine/category/${id}`, payload);

export const deleteMedicineCategoryService = (id: string) =>
  http.delete<never, any>(`/medicine/category/${id}`);
// end of medicine category

// medicine
export const createMedicineService = (payload: object) =>
  http.post<never, any>(`/medicine`, payload);

export const updateMedicineService = (payload: object, id: string) =>
  http.patch<never, any>(`/medicine/${id}`, payload);

export const deleteMedicineService = (id: string) =>
  http.delete<never, any>(`/medicine/${id}`);
// end of medicine

// stock
export const createMedicineStockService = (payload: object) =>
  http.post<never, any>(`/medicine/stock`, payload);

export const updateMedicineStockService = (payload: object, id: string) =>
  http.patch<never, any>(`/medicine/stock/${id}`, payload);

export const updateMedicineStockStatusService = (payload: object, id: string) =>
  http.post<never, any>(`/medicine/stock/${id}`, payload);

export const deleteMedicineStockService = (id: string) =>
  http.delete<never, any>(`/medicine/stock/${id}`);
// end of stock

// prescriptions
export const prescribeMedicationService = (payload: object) =>
  http.post<never, any>(`/prescription`, payload);

export const updatePrescribedMedicationService = (
  payload: object,
  id: string
) => http.patch<never, any>(`/prescription/${id}`, payload);

export const deletePrescribedMedicationService = (id: string) =>
  http.delete<never, any>(`/prescription/${id}`);
// end of prescriptions

// dispense
export const dispensePrescriptionService = (payload: object) =>
  http.post<never, any>(`/dispense`, payload);

export const getDispenseTotalService = (payload: object) =>
  http.post<never, any>(`/dispense/total`, payload);
// end of dispense
