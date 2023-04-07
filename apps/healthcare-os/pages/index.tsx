import { useEffect } from 'react';
import { useRouter } from 'next/router';

import { useStore } from '../hooks';
import routes from '../routes';
import { SpinnerIcon } from '@healthcare/icons';

export default function Index() {
  /**
   * store
   */
  const { store } = useStore();

  /**
   * routes
   */
  const router = useRouter();

  /**
   * effect
   */
  useEffect(() => {
    if (!store.isAuthenticated) {
      router.push(routes.auth.login);
    } else {
      router.push(routes.dashboard.patients.index);
    }
  }, [store, router]);

  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <SpinnerIcon size={64} />
    </div>
  );
}
