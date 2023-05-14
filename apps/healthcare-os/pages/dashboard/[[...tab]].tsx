import { useRouter } from 'next/router';
import { Tabs } from '@healthcareos/react';

import Layout from '../../components/libs/Layout';
import routes from '../../routes';

import FiltersProvider from '../../contexts/Filters';

import IncomeAndExpenditure from '../../components/pages/dashboard/IncomeAndExpenditure';
import Dashboard from '../../components/pages/dashboard/Dashboard';
import DHIMS from '../../components/pages/dashboard/DHIMS';

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
    { name: 'Dashboard', slug: 'dashboard', component: Dashboard },
    { name: 'DHIMS', slug: 'dhims', component: DHIMS },
    {
      name: 'Income & Expenditure',
      slug: 'income-and-expenditure',
      component: IncomeAndExpenditure,
    },
  ];

  return (
    <Layout title="Dashboard">
      <FiltersProvider>
        <Tabs
          tabs={tabs}
          activeKey={tab ? tab[0] : tabs[0].slug}
          onSelect={(key) =>
            router.push({
              pathname: routes.dashboard.dashboard.index.replace('[tab]', key),
            })
          }
        />
      </FiltersProvider>
    </Layout>
  );
}

export default Index;
