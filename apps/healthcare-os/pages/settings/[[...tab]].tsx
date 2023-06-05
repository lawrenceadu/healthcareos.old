import { useRouter } from 'next/router';
import { Tabs } from '@healthcareos/react';

import FiltersProvider from '../../contexts/Filters';
import Layout from '../../components/libs/Layout';
import routes from '../../routes';

import Password from '../../components/pages/settings/Password';
import Company from '../../components/pages/settings/Company';
import Profile from '../../components/pages/settings/Profile';

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
    { name: 'Company', slug: 'company', component: Company },
    { name: 'Profile', slug: 'profile', component: Profile },
    { name: 'Password', slug: 'password', component: Password },
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
