import { http } from '@healthcare/utils';

export const insuranceClaimService = (payload: object) =>
  http.post<never, any>(`/insurance/claim/submit`, payload);

export const createInsuranceClaimBatchService = (payload: object) =>
  http.post<never, any>(`/export/create`, payload);

export const updateInsuranceClaimBatchService = (payload: object, id: string) =>
  http.patch<never, any>(`/export/${id}`, payload);

export const deleteInsuranceClaimBatchService = (id: string) =>
  http.delete<never, any>(`/export/${id}`);

export const exportInsuranceClaimBatchService = (id: string) =>
  http.post<never, any>(`/export/${id}/claims`);
