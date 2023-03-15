import { http } from '@healthcare/utils';

export const getQueueInLocationService = (payload: object) =>
  http.get<never, any>(`/queue`, { params: payload });
