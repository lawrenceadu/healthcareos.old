import { http } from '@healthcare/utils';

export const loginService = (payload: { username: string; password: string }) =>
  http.post<never, any>('/auth/login', payload);

export const sendOtpService = (payload: { email: string }) =>
  http.post<never, any>('/auth/otp', payload);

export const sendResetOtpService = (payload: { email: string }) =>
  http.post<never, any>(`/auth/otp/reset`, payload);

export const verifyAccountUsingOtpService = (payload: { otp: string }) =>
  http.post<never, any>('/auth/verify', payload);

export const verifyOtpService = (payload: { otp: string; email: string }) =>
  http.post<never, any>('/auth/otp/verify', payload);

export const resetPasswordService = (payload: {
  email: string;
  otp: string;
  password: string;
}) => http.post<never, any>('/auth/reset', payload);
