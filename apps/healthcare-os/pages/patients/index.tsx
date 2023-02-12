import { useState } from 'react';
import { Button, Tabs } from '@healthcareos/react';
import { useRouter } from 'next/router';
import { helpers } from '@healthcare/utils';

import FindPatient from '../../components/pages/patients/index/FindPatient';
import ScanCard from '../../components/pages/patients/index/ScanCard';
import Layout from '../../components/libs/Layout';
import routes from '../../routes';

function Index() {
  /**
   * variables
   */
  const tabs = [
    { name: 'Find Patient', slug: 'find-patient', component: FindPatient },
    { name: 'Scan Card', slug: 'scan-card', component: ScanCard },
  ];

  /**
   * state
   */
  const [tab, setTab] = useState(tabs[0].slug);

  /**
   * routes
   */
  const router = useRouter();

  return (
    <Layout title="Patients">
      <div
        className={helpers.classNames(
          'flex bg-white',
          'w-full py-3 px-6 md:py-0 md:px-0',
          'fixed left-0 bottom-0 md:relative',
          'shadow-[0px_-1px_0px_rgba(18,18,18,0.08)] md:shadow-none'
        )}
      >
        <Button
          className="btn-outline w-full md:w-auto md:ml-auto"
          onClick={() => router.push(routes.dashboard.patients.new)}
        >
          Add patient
        </Button>
      </div>
      <Tabs
        tabs={tabs}
        activeKey={tab}
        onSelect={(key: string) => setTab(key)}
      />
    </Layout>
  );
}

export default Index;
