import { http } from '@healthcare/utils';

export const insuranceClaimService = (payload: object) =>
  http.post<never, any>(`/insurance/claim/submit`, payload);
