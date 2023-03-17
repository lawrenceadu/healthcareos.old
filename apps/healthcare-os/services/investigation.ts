import { http } from '@healthcare/utils';

export const submitInvestigationResultService = (
  payload: FormData,
  id: string
) =>
  http.post<never, any>(`/investigation/request/${id}`, payload, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const deleteInvestigationRequestService = (id: string) =>
  http.delete<never, any>(`/investigation/request/${id}`);
