import { useRouter } from 'next/router';
import { Tabs } from '@healthcareos/react';
import dynamic from 'next/dynamic';

import { usePermissions } from '../../hooks';
import Layout from '../../components/libs/Layout';
import routes from '../../routes';

const Investigations = dynamic(
  () => import('../../components/pages/resources/Investigations')
);
const Institutions = dynamic(
  () => import('../../components/pages/resources/Institutions')
);
const Departments = dynamic(
  () => import('../../components/pages/resources/Departments')
);
const Diagnoses = dynamic(
  () => import('../../components/pages/resources/Diagnoses')
);
const Locations = dynamic(
  () => import('../../components/pages/resources/Locations')
);
const Suppliers = dynamic(
  () => import('../../components/pages/resources/Suppliers')
);
const Charges = dynamic(
  () => import('../../components/pages/resources/Charges')
);
const Triage = dynamic(
  () => import('../../components/pages/resources/Triages')
);
const Wards = dynamic(() => import('../../components/pages/resources/Wards'));

function Index() {
  /**
   * routes
   */
  const router = useRouter();
  const tab = router.query.tab as string[];

  /**
   * variables
   */

  const [
    canViewDepartment,
    canViewLocation,
    canViewCharge,
    canViewWard,
    canViewInvestigation,
    canViewSupplier,
    canViewInstitution,
    canViewTriage,
  ] = usePermissions(
    'department',
    'location',
    'charge',
    'ward',
    'investigation',
    'supplier',
    'institution',
    'triage'
  );

  const tabs = [
    ...(canViewDepartment
      ? [{ name: 'Departments', slug: 'departments', component: Departments }]
      : []),
    ...(canViewLocation
      ? [{ name: 'Locations', slug: 'locations', component: Locations }]
      : []),
    ...(canViewCharge
      ? [{ name: 'Charges', slug: 'charges', component: Charges }]
      : []),
    ...(canViewWard
      ? [{ name: 'Wards', slug: 'wards', component: Wards }]
      : []),
    ...(canViewInvestigation
      ? [
          {
            name: 'Investigations',
            slug: 'investigations',
            component: Investigations,
          },
        ]
      : []),
    { name: 'Diagnoses', slug: 'diagnoses', component: Diagnoses },
    ...(canViewSupplier
      ? [{ name: 'Suppliers', slug: 'suppliers', component: Suppliers }]
      : []),
    ...(canViewInstitution
      ? [
          {
            name: 'Institutions',
            slug: 'institutions',
            component: Institutions,
          },
        ]
      : []),
    ...(canViewTriage
      ? [{ name: 'Triage', slug: 'triage', component: Triage }]
      : []),
  ];

  return (
    <Layout title="Resources">
      <Tabs
        tabs={tabs}
        activeKey={tab ? tab[0] : tabs[0].slug}
        onSelect={(key) =>
          router.push({
            pathname: routes.dashboard.resources.index.replace('[tab]', key),
          })
        }
      />
    </Layout>
  );
}

export default Index;
