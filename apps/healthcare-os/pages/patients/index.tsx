import { Button, Field } from '@healthcareos/react';
import { SearchIcon } from '@healthcare/icons';
import { useRouter } from 'next/router';
import { helpers } from '@healthcare/utils';

import PatientFilter from '../../components/pages/patients/index/PatientFilter';
import Patients from '../../components/pages/patients/index/Index';
import Layout from '../../components/libs/Layout';
import routes from '../../routes';

function Index() {
  /**
   * routes
   */
  const router = useRouter();

  return (
    <Layout title="Patients">
      <Patients />
    </Layout>
  );
}

export default Index;
