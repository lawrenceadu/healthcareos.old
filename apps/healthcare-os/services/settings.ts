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

// location
export const createLocationService = (payload: object) =>
  http.post<never, any>(`/location`, payload);

export const updateLocationService = (payload: object, id: string) =>
  http.patch<never, any>(`/location/${id}`, payload);

export const deleteLocationService = (id: string) =>
  http.delete<never, any>(`/location/${id}`);
// end of location

// facility
export const updateFacilityService = (payload: object) =>
  http.post<never, any>('/facility', payload, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
// end of facility
