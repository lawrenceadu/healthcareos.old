import { useRouter } from 'next/router';
import { Tabs } from '@healthcareos/react';

import Layout from '../../components/libs/Layout';
import routes from '../../routes';

import FiltersProvider from '../../contexts/Filters';
import Inventory from '../../components/pages/inventory/index/Inventory';
import Requests from '../../components/pages/inventory/index/Requests';
import Category from '../../components/pages/inventory/index/Category';
import Items from '../../components/pages/inventory/index/Items';
import Stock from '../../components/pages/inventory/index/Stock';

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
    { name: 'Stock', slug: 'stock', component: Stock },
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
