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
