import { useRouter } from 'next/router';
import { Tabs } from '@healthcareos/react';

import Layout from '../../components/libs/Layout';
import routes from '../../routes';

import FiltersProvider from '../../contexts/Filters';
import Adjustments from '../../components/pages/inventory/index/Adjustments';
import Inventory from '../../components/pages/inventory/index/Inventory';
import Purchases from '../../components/pages/inventory/index/Purchases';
import Transfers from '../../components/pages/inventory/index/Transfers';
import Requests from '../../components/pages/inventory/index/Requests';
import Category from '../../components/pages/inventory/index/Category';
import Items from '../../components/pages/inventory/index/Items';

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
    { name: 'Inventory', slug: 'inventory', component: Inventory },
    { name: 'Requests', slug: 'requests', component: Requests },
    { name: 'Adjustments', slug: 'adjustments', component: Adjustments },
    { name: 'Transfers', slug: 'transfer', component: Transfers },
    { name: 'Purchases', slug: 'purchases', component: Purchases },
    { name: 'Items', slug: 'items', component: Items },
    { name: 'Category', slug: 'category', component: Category },
  ];

  return (
    <Layout title="Inventory">
      <FiltersProvider>
        <Tabs
          tabs={tabs}
          activeKey={tab ? tab[0] : tabs[0].slug}
          onSelect={(key) =>
            router.push({
              pathname: routes.dashboard.inventory.index.replace('[tab]', key),
            })
          }
        />
      </FiltersProvider>
    </Layout>
  );
}

export default Index;
