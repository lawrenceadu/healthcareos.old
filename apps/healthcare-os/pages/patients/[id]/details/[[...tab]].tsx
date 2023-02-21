import { useState } from 'react';
import { helpers, useWidth } from '@healthcare/utils';
import { ChevronRightIcon } from '@healthcare/icons';
import { useRouter } from 'next/router';
import { Tabs } from '@healthcareos/react';

import Patient from '../../../../components/libs/Patient';
import Layout from '../../../../components/libs/Layout';
import routes from '../../../../routes';
import NoSSR from '../../../../components/libs/NoSSR';

export async function getServerSideProps(context) {
  return {
    props: {}, // will be passed to the page component as props
  };
}

function Details() {
  /**
   * hooks
   */
  const width = useWidth();

  /**
   * routes
   */
  const router = useRouter();
  const { id, tab: paths } = router.query;

  /**
   * variables
   */
  const tab = paths && paths[0];
  const tabs = [
    { name: 'Overview', slug: 'overview', component: Patient.Overview },
    { name: 'History', slug: 'history', component: Patient.History },
    { name: 'Insurance', slug: 'insurance', component: Patient.Insurance },
    { name: 'Invoice', slug: 'invoice', component: Patient.Invoice },
  ];

  return (
    <Layout
      onBack
      title="Patient profile"
      className={helpers.classNames(
        'p-4',
        // md
        'md:px-12',
        // xl
        'xl:grid xl:grid-cols-[minmax(0,1fr),504px]',
        'xl:h-[calc(100%-4.5rem)] xl:px-0 xl:py-0 '
      )}
    >
      <NoSSR>
        {width && width < 1280 && (
          <div
            role="button"
            onClick={() =>
              router.push({
                pathname: routes.dashboard.patients.details.info,
                query: { id },
              })
            }
            className={helpers.classNames(
              'py-3 px-4 mb-6',
              'rounded-lg border border-gray-200',
              'flex justify-between items-center'
            )}
          >
            <p className="text-lg font-bold">Patient information</p>
            <div className="flex items-center gap-1">
              <small>View</small>
              <ChevronRightIcon />
            </div>
          </div>
        )}

        <div className="xl:px-10 h-full xl:border-r xl:border-gray-200">
          <Tabs
            tabs={tabs}
            activeKey={tab || tabs[0].slug}
            onSelect={(key) =>
              router.push({
                pathname: routes.dashboard.patients.details.index
                  .replace('[id]', String(id))
                  .replace('[tab]', key),
              })
            }
          />
        </div>
        {width && width >= 1280 && (
          <div
            className={helpers.classNames(
              'hidden',
              'xl:flex xl:flex-col',
              'xl:h-full xl:overflow-y-auto xl:relative'
            )}
          >
            <div className="p-6">
              <Patient.Info className="mb-6" />
              <Patient.SideTabs />
            </div>
            <Patient.Actions className="mt-auto sticky bottom-0" />
          </div>
        )}
      </NoSSR>
    </Layout>
  );
}

export default Details;
