import { useRouter } from 'next/router';
import { Tabs } from '@healthcareos/react';

import Layout from '../../components/libs/Layout';
import routes from '../../routes';

import Members from '../../components/pages/members/index/Members';
import Roles from '../../components/pages/members/index/Roles';

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
    { name: 'Members', slug: 'members', component: Members },
    { name: 'Roles', slug: 'roles', component: Roles },
  ];

  return (
    <Layout title="Members">
      <Tabs
        tabs={tabs}
        activeKey={tab ? tab[0] : tabs[0].slug}
        onSelect={(key) =>
          router.push({
            pathname: routes.dashboard.members.index.replace('[tab]', key),
          })
        }
      />
    </Layout>
  );
}

export default Index;
