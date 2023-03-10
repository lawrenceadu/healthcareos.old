import { useContext } from 'react';
import { StoreContext } from '../contexts/Store';

function useStore() {
  /**
   * context
   */
  const store = useContext(StoreContext);

  return store;
}

export default useStore;
