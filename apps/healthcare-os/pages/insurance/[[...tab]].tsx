import { useRouter } from 'next/router';
import { Tabs } from '@healthcareos/react';

import Layout from '../../components/libs/Layout';
import Claims from '../../components/pages/insurance/Claims';
import routes from '../../routes';
import Batch from '../../components/pages/insurance/Batch';

function Index() {
  /**
   * routes
   */
  const router = useRouter();
  const tab = router?.query?.tab?.[0] as string;

  /**
   * variables
   */
  const tabs = [
    { name: 'Claims', slug: 'claims', component: Claims },
    { name: 'Batch', slug: 'batch', component: Batch },
  ];

  return (
    <Layout title="Insurance claims">
      <Tabs
        tabs={tabs}
        activeKey={tab || tabs[0].slug}
        onSelect={(key) =>
          router.push(`${routes.dashboard.insurance.index}/${key}`)
        }
      />
    </Layout>
  );
}

export default Index;
