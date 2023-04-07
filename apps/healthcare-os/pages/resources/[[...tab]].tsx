import { useRouter } from 'next/router';
import { Tabs } from '@healthcareos/react';

import Layout from '../../components/libs/Layout';
import routes from '../../routes';

import Investigations from '../../components/pages/resources/Investigations';
import Institutions from '../../components/pages/resources/Institutions';
import Departments from '../../components/pages/resources/Departments';
import Diagnoses from '../../components/pages/resources/Diagnoses';
import Locations from '../../components/pages/resources/Locations';
import Suppliers from '../../components/pages/resources/Suppliers';
import Charges from '../../components/pages/resources/Charges';
import Triage from '../../components/pages/resources/Triages';
import Wards from '../../components/pages/resources/Wards';

function Index() {
  /**
   * routes
   */
  const router = useRouter();
  const tab = router.query.tab as string[];

  /**
   * variables
   */
  const tabs = [
    { name: 'Departments', slug: 'departments', component: Departments },
    { name: 'Locations', slug: 'locations', component: Locations },
    { name: 'Charges', slug: 'charges', component: Charges },
    { name: 'Wards', slug: 'wards', component: Wards },
    { name: 'Investigations', slug: 'investigations', component: Investigations }, // prettier-ignore
    { name: 'Diagnoses', slug: 'diagnoses', component: Diagnoses },
    { name: 'Suppliers', slug: 'suppliers', component: Suppliers },
    { name: 'Institutions', slug: 'institutions', component: Institutions },
    { name: 'Triage', slug: 'triage', component: Triage },
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
