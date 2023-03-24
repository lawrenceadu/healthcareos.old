import { http } from '@healthcare/utils';

// roles
export const createRoleService = (payload: object) =>
  http.post<never, any>('/role', payload);

export const updateRoleService = (payload: object, id: string) =>
  http.patch<never, any>(`/role/${id}`, payload);

export const deleteRoleService = (id: string) =>
  http.delete<never, any>(`/role/${id}`);
// end of roles

// members
export const inviteMemberService = (payload: object) =>
  http.post<never, any>(`/user`, payload);
// end of members
