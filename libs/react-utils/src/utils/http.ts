import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios'; // prettier-ignore

// let store: any;
// let logout: any;

// // redux stuff
// export const injectStore = (_store: any) => {
//   store = _store;
// };

// export const injectLogout = (_logout: any) => {
//   logout = _logout;
// };

export const http = axios.create({
  timeout: 45000,
  baseURL: process.env['NX_BASE_API'],
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    AppId: 'web',
  },
});

http.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const store = (() => {
    const store = JSON.parse(
      localStorage.getItem(process.env['NX_STORAGE_KEY'] as string) as string
    );
    return store;
  })();

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
        // if (store && logout) {
        //   store.dispatch(logout());
        // }
      }

      return Promise.reject(error?.response?.data);
    }

    if (error.response?.status === 500) {
      return Promise.reject({ message: 'Internal server error' });
    }

    return;
  }
);

export default http;
