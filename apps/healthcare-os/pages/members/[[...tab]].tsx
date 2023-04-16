import { useRouter } from 'next/router';
import { Tabs } from '@healthcareos/react';
import dynamic from 'next/dynamic';

import { usePermissions } from '../../hooks';
import Layout from '../../components/libs/Layout';
import routes from '../../routes';

const Members = dynamic(
  () => import('../../components/pages/members/index/Members')
);
const Roles = dynamic(
  () => import('../../components/pages/members/index/Roles')
);

function Index() {
  /**
   * routes
   */
  const router = useRouter();
  const tab = router.query.tab as string[];

  /**
   * perm
   */
  const [canViewMember, canViewRole] = usePermissions('user', 'role');

  /**
   * variables
   */
  const tabs = [
    ...(canViewMember
      ? [{ name: 'Members', slug: 'members', component: Members }]
      : []),
    ...(canViewRole
      ? [{ name: 'Roles', slug: 'roles', component: Roles }]
      : []),
  ];

  return (
    <Layout title="Members">
      <Tabs
        tabs={tabs}
        activeKey={tab ? tab[0] : tabs[0]?.slug}
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
