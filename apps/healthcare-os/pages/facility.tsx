import { useEffect } from 'react';
import { useRouter } from 'next/router';

import { useStore } from '../hooks';
import routes from '../routes';
import Image from 'next/image';

function Facility() {
  /**
   * store
   */
  const { store, setStore } = useStore();

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
    }
  }, [store, router]);

  return (
    <div className="h-full p-6 flex">
      {store?.isAuthenticated && (
        <div className="m-auto max-w-[480px] w-full">
          <p className="text-2xl mb-6 font-semibold">Select Facility</p>

          <div className="grid gap-4 md:grid-cols-2">
            {store?.user?.facilities.map((facility, key) => (
              <div
                key={key}
                role="button"
                className="border-2 border-gray-200 rounded-xl p-6 relative"
                onClick={() => {
                  setStore((store) => ({
                    ...store,
                    facility,
                    role: facility.role,
                    permissions: facility.permissions,
                  }));

                  router.push(routes.dashboard.patients.index);
                }}
              >
                <Image
                  width={32}
                  height={32}
                  src={facility.logo}
                  alt="Facility logo"
                  className="mb-4 object-center object-cover"
                />

                <p className="font-semibold">{facility.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Facility;
