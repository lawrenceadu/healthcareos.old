import { useRouter } from 'next/router';
import { Tabs } from '@healthcareos/react';

import Layout from '../../components/libs/Layout';
import routes from '../../routes';

import FiltersProvider from '../../contexts/Filters';
import Prescriptions from '../../components/pages/pharmacy/index/Prescriptions';
import Inventory from '../../components/pages/pharmacy/index/Inventory';
import Category from '../../components/pages/pharmacy/index/Category';
import Items from '../../components/pages/pharmacy/index/Items';
import Stock from '../../components/pages/pharmacy/index/Stock';

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
    { name: 'Prescriptions', slug: 'prescriptions', component: Prescriptions },
    { name: 'Inventory', slug: 'inventory', component: Inventory },
    { name: 'Stock', slug: 'stock', component: Stock },
    { name: 'Items', slug: 'items', component: Items },
    { name: 'Category', slug: 'category', component: Category },
  ];

  return (
    <Layout title="Pharmacy">
      <FiltersProvider>
        <Tabs
          tabs={tabs}
          activeKey={tab ? tab[0] : tabs[0].slug}
          onSelect={(key) =>
            router.push({
              pathname: routes.dashboard.pharmacy.index.replace('[tab]', key),
            })
          }
        />
      </FiltersProvider>
    </Layout>
  );
}

export default Index;
