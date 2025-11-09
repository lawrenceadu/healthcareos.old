import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios'; // prettier-ignore

let store: any;

export const injectStore = (_store: any) => {
  store = _store;
};

export const http = axios.create({
  timeout: 45000,
  baseURL: process.env['NEXT_PUBLIC_BASE_API'],
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    AppId: 'web',
  },
});

http.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (config.headers) {
    if (store?.token) {
      config.headers['authorization'] = `Bearer ${store.token}`;
    }

    if (store?.facility) {
      config.headers['FacilityId'] = store?.facility?.id;
    }
  }

  return config;
});

http.interceptors.response.use(
  (response: AxiosResponse) => response.data,
  (error: AxiosError<string>) => {
    if (error.response?.status !== 500) {
      if (error.response?.status === 401) {
        if (store?.logout) {
          store.logout?.();
        }
      }

      return Promise.reject(error?.response?.data);
    }

    if (error.response?.status === 500) {
      return Promise.reject({ message: 'Internal server error' });
    }

    return;
  }
);

export default Object.assign(http, { injectStore });
