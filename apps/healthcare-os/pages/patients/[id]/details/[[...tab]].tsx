import { helpers, useWidth } from '@healthcare/utils';
import { Button, Tabs } from '@healthcareos/react';
import { useRouter } from 'next/router';
import { AddIcon } from '@healthcare/icons';

import Patient from '../../../../components/libs/Patient';
import Layout from '../../../../components/libs/Layout';
import routes from '../../../../routes';
import NoSSR from '../../../../components/libs/NoSSR';
import Float from '../../../../components/libs/Float';

import { usePatient } from '../../../../hooks';

function Details() {
  /**
   * hooks
   */
  const width = useWidth();
  const { patient } = usePatient();

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
    ...(patient.is_inpatient
      ? [
          { name: 'Overview', slug: 'overview', component: Patient.Overview },
          { name: 'Notes', slug: 'notes', component: Patient.Notes },
          { name: 'History', slug: 'history', component: Patient.History },
          {
            name: 'Drug chart',
            slug: 'drug',
            component: () => <div className="text-2xl font-bold">WIP</div>,
          },
          { name: 'Invoice', slug: 'invoice', component: Patient.Invoice },
        ]
      : []),

    ...(!patient.is_inpatient
      ? [
          { name: 'History', slug: 'history', component: Patient.History },
          {
            name: 'Insurance',
            slug: 'insurance',
            component: Patient.Insurance,
          },
          { name: 'Invoice', slug: 'invoice', component: Patient.Invoice },
        ]
      : []),
  ];
  const isMobile = width && width < 1280;

  return (
    <Layout
      onBack
      title="Patient profile"
      className={helpers.classNames(
        'p-4',
        'md:px-12',
        'xl:grid xl:grid-cols-[minmax(0,1fr),504px]',
        'xl:h-[calc(100%-4.5rem)] xl:px-0 xl:py-0'
      )}
      topNav={<Patient.Dropdown />}
    >
      <NoSSR>
        {isMobile && (
          <Patient.Info
            className={helpers.classNames(
              'py-3 px-4 mb-6',
              'rounded-lg border border-gray-200'
            )}
          />
        )}

        <div className="xl:px-10 h-full xl:overflow-y-auto xl:border-r xl:border-gray-200">
          <Tabs
            tabs={tabs}
            className="pb-24"
            activeKey={tab || tabs[0].slug}
            navClassName="sticky top-0 bg-white z-[1]"
            onSelect={(key) =>
              router.push({
                pathname: routes.dashboard.patients.details.index
                  .replace('[id]', String(id))
                  .replace('[tab]', key),
              })
            }
          />

          {isMobile && (
            <Patient.QuickActions>
              {({ proceed }) => (
                <Float>
                  <Button
                    className="btn btn-primary z-[10]"
                    onClick={() => proceed()}
                  >
                    <AddIcon />
                    <span>Perform action</span>
                  </Button>
                </Float>
              )}
            </Patient.QuickActions>
          )}
        </div>

        {/* patient profile with quick actions */}
        {!isMobile && (
          <div
            className={helpers.classNames(
              'hidden',
              'xl:flex xl:flex-col',
              'xl:h-full xl:overflow-y-auto xl:relative'
            )}
          >
            <div className="p-6">
              <Patient.Info className="mb-6" />
              <Patient.QuickActions />
            </div>
          </div>
        )}
      </NoSSR>
    </Layout>
  );
}

export default Details;
