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

// purchase
export const createMedicinePurchaseService = (payload: object) =>
  http.post<never, any>(`/medicine/purchase`, payload);

export const updateMedicinePurchaseService = (payload: object, id: string) =>
  http.patch<never, any>(`/medicine/purchase/${id}`, payload);

export const updateMedicinePurchaseStatusService = (
  payload: object,
  id: string
) => http.post<never, any>(`/medicine/purchase/${id}`, payload);

export const deleteMedicinePurchaseService = (id: string) =>
  http.delete<never, any>(`/medicine/purchase/${id}`);
// end of purchase

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

export const printPrescriptionService = (payload: object) =>
  http.post<never, any>(`/dispense/print`, payload);
// end of dispense

// transfer
export const createMedicineTransferService = (payload: object) =>
  http.post<never, any>('/medicine/transfer', payload);

export const updateMedicineTransferService = (payload: object, id: string) =>
  http.patch<never, any>(`/medicine/transfer/${id}`, payload);

export const updateMedicineTransferStatusService = (
  payload: object,
  id: string
) => http.post<never, any>(`/medicine/transfer/${id}`, payload);

export const deleteMedicineTransferService = (id: string) =>
  http.delete<never, any>(`/medicine/transfer/${id}`);
// end of transfer

// adjustment
export const createMedicineAdjustmentService = (payload: object) =>
  http.post<never, any>('/medicine/stock', payload);

export const updateMedicineAdjustmentService = (payload: object, id: string) =>
  http.patch<never, any>(`/medicine/stock/${id}`, payload);

export const updateMedicineAdjustmentStatusService = (
  payload: object,
  id: string
) => http.post<never, any>(`/medicine/stock/${id}`, payload);

export const deleteMedicineAdjustmentService = (id: string) =>
  http.delete<never, any>(`/medicine/stock/${id}`);
// end of adjustment
