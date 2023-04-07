import { Dispatch, SetStateAction, createContext, useEffect, useState } from 'react'; // prettier-ignore
import { useSWRConfig } from 'swr';
import { useRouter } from 'next/router';

import { FacilityModel, UserModel } from '../models';

export interface StoreInterface {
  token: string;
  user: UserModel;
  facility: FacilityModel;
  role: FacilityModel['role'];
  permissions: FacilityModel['permissions'];
  isAuthenticated: boolean;
  logout: () => void;
}

export const StoreContext = createContext<{
  store: Partial<StoreInterface>;
  setStore: Dispatch<SetStateAction<Partial<StoreInterface>>>;
}>({
  store: {},
  setStore: () => null,
});

const StoreProvider = ({ children }: { children: any }) => {
  /**
   * api
   */
  const { mutate } = useSWRConfig();

  /**
   * state
   */
  const [store, setStore] = useState<Partial<StoreInterface>>(() => {
    if (typeof window !== 'undefined') {
      const store = window.localStorage.getItem(process.env['NX_STORAGE_KEY']);

      if (store) {
        return JSON.parse(store);
      }
    }

    return null;
  });

  /**
   * variables
   */
  const isAuthenticated = !!(store?.user && store?.token);

  /**
   * routes
   */
  const router = useRouter();

  /**
   * functions
   */
  const logout = () => {
    setStore({});
   
    mutate(() => true, undefined, { revalidate: false });
    sessionStorage.clear();
   
    router.push({ pathname: '/login' });
  };

  /**
   * effect
   */
  useEffect(() => {
    if (store) {
      window.localStorage.setItem(
        process.env['NX_STORAGE_KEY'],
        JSON.stringify(store)
      );
    }
  }, [store]);

  return (
    <StoreContext.Provider
      value={{ store: { ...store, isAuthenticated, logout }, setStore }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export default StoreProvider;
