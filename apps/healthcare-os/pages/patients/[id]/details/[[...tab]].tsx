import { helpers, useWidth } from '@healthcare/utils';
import { Button, Tabs } from '@healthcareos/react';
import { useRouter } from 'next/router';
import { AddIcon } from '@healthcare/icons';

import { usePatient, usePermissions } from '../../../../hooks';
import Patient from '../../../../components/libs/Patient';
import Layout from '../../../../components/libs/Layout';
import routes from '../../../../routes';
import Float from '../../../../components/libs/Float';

function Details() {
  /**
   * routes
   */
  const router = useRouter();
  const { id, tab: paths } = router.query;

  /**
   * perm
   */
  const [canViewInvoice] = usePermissions('invoice_view');

  /**
   * hooks
   */
  const width = useWidth();
  const { patient } = usePatient();

  /**
   * variables
   */
  const tab = paths && paths[0];
  const isInPatient = ['admitted', 'detained'].includes(patient?.status);
  const tabs = [
    ...(isInPatient
      ? [{ name: 'Overview', slug: 'overview', component: Patient.Overview }]
      : []),
    { name: 'History', slug: 'history', component: Patient.History },
    { name: 'Notes', slug: 'notes', component: Patient.Notes },
    { name: 'Vitals', slug: 'vitals', component: Patient.Chart.Vitals },
    ...(isInPatient
      ? [{ name: 'Drug chart', slug: 'drug', component: Patient.DrugChart }]
      : []),
    {
      name: 'Insurance',
      slug: 'insurance',
      component: Patient.Insurance,
    },
    ...(canViewInvoice
      ? [{ name: 'Invoice', slug: 'invoice', component: Patient.Invoice }]
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
      {patient && (
        <>
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
        </>
      )}
    </Layout>
  );
}

export default Details;
