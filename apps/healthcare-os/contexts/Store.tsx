import { Dispatch, SetStateAction, createContext, useEffect, useState } from 'react'; // prettier-ignore
import { useRouter } from 'next/router';

import { UserModel } from '../models/user';

export interface StoreInterface {
  token: string;
  user: UserModel;
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
   * state
   */
  const [store, setStore] = useState<Partial<StoreInterface>>();

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
    setStore({ token: null, user: null, isAuthenticated: null });
    router.push('/');
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

  useEffect(() => {
    const store = window.localStorage.getItem(process.env['NX_STORAGE_KEY']);

    if (store) {
      setStore(JSON.parse(store));
    }
  }, []);

  return (
    <StoreContext.Provider
      value={{ store: { ...store, isAuthenticated, logout }, setStore }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export default StoreProvider;
