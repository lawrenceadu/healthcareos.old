import { useState, useCallback } from 'react';

const useSession = <T>(key: string): [T | undefined, (value: T) => void] => {
  /**
   * state
   */
  const [session, setSession] = useState<T>(() => {
    if (typeof window !== 'undefined') {
      const storage: Storage = window.sessionStorage;

      try {
        return JSON.parse(storage.getItem(key) || '');
      } catch {
        return null;
      }
    }
    return null;
  });

  /**
   * functions
   */
  const setItem = (value: T) => {
    const storage: Storage = window.sessionStorage;

    if (value) {
      storage.setItem(key, JSON.stringify(value));
    } else {
      storage.removeItem(key);
    }
    return setSession(value);
  };

  return [session, setItem];
};

export default useSession;
