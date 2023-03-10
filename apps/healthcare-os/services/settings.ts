import { http } from '@healthcare/utils';

export const updatePasswordService = (payload: {
  current_password: string;
  new_password: string;
  confirm_password: string;
}) => http.post<never, any>('/auth/password', payload);

export const updateProfileService = (payload: FormData) =>
  http.post<never, any>(`/profile`, payload, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
