import { useRouter } from 'next/router';
import { Tabs } from '@healthcareos/react';

import Layout from '../../components/libs/Layout';
import routes from '../../routes';

import { usePermissions } from '../../hooks';
import FiltersProvider from '../../contexts/Filters';
import Prescriptions from '../../components/pages/pharmacy/index/Prescriptions';
import Adjustments from '../../components/pages/pharmacy/index/Adjustments';
import Inventory from '../../components/pages/pharmacy/index/Inventory';
import Purchases from '../../components/pages/pharmacy/index/Purchases';
import Transfers from '../../components/pages/pharmacy/index/Transfers';
import Medicines from '../../components/pages/pharmacy/index/Medicines';
import Category from '../../components/pages/pharmacy/index/Category';

function Index() {
  /**
   * routes
   */
  const router = useRouter();
  const tab = router.query.tab as string[];

  /**
   * perm
   */
  const [
    canViewPrescription,
    canViewInventory,
    canViewAdjustment,
    canViewTransfer,
    canViewPurchase,
    canViewMedicine,
    canViewCategory,
  ] = usePermissions(
    'prescription',
    'pharmacyinventory',
    'medicinestock',
    'medicinetransfer',
    'medicinepurchase',
    'medicine',
    'medicinecategory'
  );

  /**
   * variables
   */
  const tabs = [
    ...(canViewPrescription
      ? [
          {
            name: 'Prescriptions',
            slug: 'prescriptions',
            component: Prescriptions,
          },
        ]
      : []),
    ...(canViewInventory
      ? [{ name: 'Inventory', slug: 'inventory', component: Inventory }]
      : []),
    ...(canViewAdjustment
      ? [{ name: 'Adjustments', slug: 'adjustments', component: Adjustments }]
      : []),
    ...(canViewTransfer
      ? [{ name: 'Transfers', slug: 'transfer', component: Transfers }]
      : []),
    ...(canViewPurchase
      ? [{ name: 'Purchases', slug: 'purchases', component: Purchases }]
      : []),
    ...(canViewMedicine
      ? [{ name: 'Medicines', slug: 'medicines', component: Medicines }]
      : []),
    ...(canViewCategory
      ? [{ name: 'Category', slug: 'category', component: Category }]
      : []),
  ];

  return (
    <Layout title="Pharmacy">
      <FiltersProvider>
        <Tabs
          tabs={tabs}
          activeKey={tab ? tab[0] : tabs[0]?.slug}
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
