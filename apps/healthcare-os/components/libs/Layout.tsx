import { HtmlHTMLAttributes, ReactElement, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { helpers } from '@healthcare/utils';
import { Button } from '@healthcareos/react';
import { motion } from 'framer-motion';
import * as Icon from '@healthcare/icons';
import useSWRImmutable from 'swr/immutable';
import Image from 'next/image';
import Head from 'next/head';
import Link from 'next/link';

import { usePermissions, useStore } from '../../hooks';
import { UserModel } from '../../models';
import routes from '../../routes';

export interface LayoutProps extends HtmlHTMLAttributes<HTMLDivElement> {
  onBack?: (() => void) | boolean;
  title?: string;
  topNav?: ReactElement;
}

export function Layout({
  title,
  onBack,
  topNav,
  children,
  className,
}: LayoutProps) {
  /**
   * routes
   */
  const router = useRouter();

  /**
   * store
   */
  const { store, setStore } = useStore();

  /**
   * api
   */
  useSWRImmutable<{ user: UserModel }>(store?.user && `/profile`, null, {
    onSuccess: ({ user }) => {
      const facility = user.facilities.find((f) => f.id === store.facility?.id);
      if (facility) {
        setStore((store) => ({
          ...store,
          user,
          facility,
          role: facility.role,
          permissions: facility.permissions,
        }));
      }
    },
  });

  /**
   * hooks
   */
  const [
    canViewPatient,
    canViewInvoice,
    canViewWard,
    canViewQueue,
    canViewResource,
    canViewPharmacy,
    canViewMembers,
    canViewInvestigation,
    canViewInventory,
  ] = usePermissions(
    'patient',
    'invoice',
    'ward',
    'queue',
    'resource',
    'pharmacy',
    'user',
    'investigationrequest',
    'item'
  );

  /**
   * state
   */
  const [toggle, setToggle] = useState(false);
  const [show, setShow] = useState(false);

  /**
   * variables
   */
  const navlinks = [
    {
      name: 'Dashboard',
      icon: Icon.DashboardIcon,
      link: routes.dashboard.dashboard.index.replace('[tab]', ''),
    },
    ...(canViewPatient
      ? [
          {
            name: 'Patients',
            icon: Icon.UsersIcon,
            link: routes.dashboard.patients.index,
          },
        ]
      : []),
    ...(canViewInventory
      ? [
          {
            name: 'Inventory',
            icon: Icon.PackageIcon,
            link: routes.dashboard.inventory.index.replace('[tab]', ''),
          },
        ]
      : []),
    ...(canViewPharmacy
      ? [
          {
            name: 'Pharmacy',
            icon: Icon.DrugIcon,
            link: routes.dashboard.pharmacy.index.replace('[tab]', ''),
          },
        ]
      : []),
    ...(canViewInvestigation
      ? [
          {
            name: 'Investigations',
            icon: Icon.MicroscopeIcon,
            link: routes.dashboard.investigations.index,
          },
        ]
      : []),
    ...(canViewQueue
      ? [
          {
            name: 'Queuing',
            icon: Icon.UserQueueIcon,
            link: routes.dashboard.queuing.index,
          },
        ]
      : []),
    ...(canViewWard
      ? [
          {
            name: 'Wards',
            icon: Icon.BedIcon,
            link: routes.dashboard.wards.index,
          },
        ]
      : []),
    ...(canViewInvoice
      ? [
          {
            name: 'Invoices',
            icon: Icon.WalletIcon,
            link: routes.dashboard.invoices.index,
          },
        ]
      : []),
    ...(canViewResource
      ? [
          {
            name: 'Resources',
            icon: Icon.LayersIcon,
            link: routes.dashboard.resources.index.replace('[tab]', ''),
          },
        ]
      : []),
    ...(canViewMembers
      ? [
          {
            name: 'Members',
            icon: Icon.UsersIcon,
            link: routes.dashboard.members.index.replace('[tab]', ''),
          },
        ]
      : []),
    {
      name: 'Settings',
      icon: Icon.SettingsIcon,
      link: routes.dashboard.settings.index.replace('[tab]', ''),
    },
  ];

  /**
   * functions
   */
  const handleActive = (link) => {
    return router.pathname.startsWith(link);
  };

  /**
   * effect
   */
  useEffect(() => {
    if (store.user && !store.isAuthenticated) {
      store.logout();
    }

    if (store.isAuthenticated && !store.facility) {
      router.push(routes.auth.facility);
    }

    if (!store.isAuthenticated) {
      router.push(routes.auth.login);
    }
  }, [store, router]);

  return (
    <>
      {title && (
        <Head>
          <title>{`${title} - HealthcareOS`}</title>
        </Head>
      )}

      {store.isAuthenticated && (
        <>
          <div
            className={helpers.classNames(
              'h-full w-full',
              'lg:grid lg:grid-cols-[280px_minmax(0,1fr)]'
            )}
          >
            {/* sidenav */}
            <div
              className={helpers.classNames(
                'w-[280px] h-full overflow-y-auto',
                'fixed left-0 top-0 lg:relative',
                'border-r border-gray-300 bg-white',
                'flex flex-col gap-10',
                'transition-[margin]',
                'lg:ml-0 px-6 py-4',
                'z-[1000]',
                toggle ? 'ml-0' : '-ml-[280px]'
              )}
            >
              <div className="flex items-center gap-2 text-primary">
                <div className="w-10 h-10 rounded-full bg-primary flex">
                  <Icon.HeartHandIcon className="text-white m-auto" />
                </div>
                <p className="font-bold">{process.env.NX_APP_NAME}</p>
              </div>

              <div>
                {navlinks.map(({ link, name, ...item }, key) => (
                  <Link
                    key={key}
                    href={link}
                    className={helpers.classNames(
                      'rounded-lg',
                      'p-3 h-12 mb-1',
                      'flex gap-3 items-center',
                      handleActive(link) &&
                        'bg-primary font-semibold text-white'
                    )}
                  >
                    <span>
                      <item.icon
                        {...(handleActive(link) && { variant: 'solid' })}
                      />
                    </span>
                    <span>{name}</span>
                  </Link>
                ))}
              </div>

              <div className="mt-auto flex items-center">
                <div className="rounded-full w-10 h-10 flex bg-primary text-white mr-2 relative overflow-hidden">
                  {store?.user?.photo ? (
                    <Image
                      fill
                      alt="Profile"
                      src={store.user.photo}
                      className="object-cover object-center"
                    />
                  ) : (
                    <p className="text-lg m-auto font-bold">
                      {store.user?.name
                        ?.split(' ')
                        ?.map((n) => n[0])
                        .join('') || '--'}
                    </p>
                  )}
                </div>
                <div>
                  <p className="text-sm font-bold">
                    {store?.user?.name || '--'}
                  </p>
                  <p className="text-xs text-muted font-semibold">
                    {store?.role?.name || '--'}
                  </p>
                </div>

                <Button
                  aria-label="Logout"
                  className="ml-auto text-red-500"
                  onClick={() => {
                    store.logout();
                  }}
                >
                  <Icon.LogoutIcon />
                </Button>
              </div>
            </div>
            {/* end of sidenav */}

            {/* content */}
            <div className="h-full overflow-y-auto">
              {/* top nav */}
              <div
                className={helpers.classNames(
                  'top-0 sticky',
                  'bg-white z-[100]',
                  'h-14 md:h-[4.5rem]',
                  'flex items-center',
                  'px-4 md:px-12 lg:px-10'
                )}
              >
                <div
                  className={helpers.classNames('-ml-3', !onBack && 'lg:ml-0')}
                >
                  {onBack && (
                    <Button
                      aria-label="Go back"
                      className="!px-0 w-12 mr-2"
                      onClick={() => {
                        if (typeof onBack === 'function') {
                          return onBack();
                        }

                        router.back();
                      }}
                    >
                      <Icon.ArrowLeftIcon />
                    </Button>
                  )}
                  {!onBack && (
                    <Button
                      aria-label="Toggle menu"
                      className="lg:!hidden !px-0 w-12 mr-2"
                      onClick={() => {
                        setToggle(() => {
                          setShow(true);
                          return true;
                        });
                      }}
                    >
                      <Icon.MenuIcon />
                    </Button>
                  )}
                </div>

                {title && <h4 className="truncate">{title}</h4>}

                {topNav}
              </div>
              {/* end of top nav */}

              {/* main content */}
              <div
                className={helpers.classNames(
                  className || 'p-4 md:px-12 lg:px-10 lg:py-6'
                )}
              >
                {children}
              </div>
              {/* end of main content */}
            </div>
            {/* end of content */}
          </div>

          {show && (
            <motion.div
              initial={{ opacity: 0 }}
              onClick={() => {
                setToggle(!toggle);
                setTimeout(() => setShow(false), 300);
              }}
              animate={{
                opacity: toggle ? 0.6 : 0,
              }}
              className={helpers.classNames(
                'cursor-pointer fixed h-full w-full top-0 left-0 bg-black z-[999] opacity-60 select-none'
              )}
            />
          )}
        </>
      )}
    </>
  );
}

export default Layout;
