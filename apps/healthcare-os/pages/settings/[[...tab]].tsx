import { useRouter } from 'next/router';
import { Tabs } from '@healthcareos/react';

import FiltersProvider from '../../context/Filters';
import Layout from '../../components/libs/Layout';
import routes from '../../routes';

import Members from '../../components/pages/settings/Members';
import Profile from '../../components/pages/settings/Profile';
import Password from '../../components/pages/settings/Password';
import Locations from '../../components/pages/settings/Locations';

function Index() {
  /**
   * routes
   */
  const router = useRouter();
  const tab = router.query.tab;

  /**
   * variables
   */
  const tabs = [
    { name: 'Profile', slug: 'profile', component: Profile },
    { name: 'Password', slug: 'password', component: Password },
    { name: 'Locations', slug: 'locations', component: Locations },
    { name: 'Members', slug: 'members', component: Members },
  ];

  return (
    <Layout title="Settings">
      <FiltersProvider>
        <Tabs
          activeKey={tab ? tab[0] : tabs[0].slug}
          tabs={tabs}
          onSelect={(key) =>
            router.push({
              pathname: routes.dashboard.settings.index.replace('[tab]', key),
            })
          }
        />
      </FiltersProvider>
    </Layout>
  );
}

export default Index;
