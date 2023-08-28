import { useRouter } from 'next/router';
import { Tabs } from '@healthcareos/react';

import { usePermissions } from '../../hooks';
import IncomeAndExpenditure from '../../components/pages/dashboard/IncomeAndExpenditure';
import FiltersProvider from '../../contexts/Filters';
import Layout from '../../components/libs/Layout';
import routes from '../../routes';

import Dashboard from '../../components/pages/dashboard/Dashboard';
import DHIMS from '../../components/pages/dashboard/DHIMS';

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
    patientSummary,
    diagnosesSummary,
    investigationSummary,
    medicationSummary,
    wardSummary,
    financeSummary,
  ] = usePermissions(
    'report_patient_summary',
    'report_diagnosis_summary',
    'report_investigation_request_summary',
    'report_medicine_summary',
    'report_ward_summary',
    'report_finance_summary'
  );

  /**
   * variables
   */
  const tabs = [
    ...(patientSummary ||
    diagnosesSummary ||
    investigationSummary ||
    medicationSummary ||
    wardSummary
      ? [{ name: 'Dashboard', slug: 'dashboard', component: Dashboard }]
      : []),
    // { name: 'DHIMS', slug: 'dhims', component: DHIMS },
    ...(financeSummary
      ? [
          {
            name: 'Income & Expenditure',
            slug: 'income-and-expenditure',
            component: IncomeAndExpenditure,
          },
        ]
      : []),
    {
      name: 'DHIMS',
      slug: 'dhims',
      component: DHIMS,
    },
  ];

  return (
    <Layout title="Dashboard">
      <FiltersProvider>
        <Tabs
          tabs={tabs}
          activeKey={tab ? tab[0] : tabs[0]?.slug}
          onSelect={(key) =>
            router.push({
              pathname: routes.dashboard.dashboard.index.replace('[tab]', key),
            })
          }
        />
      </FiltersProvider>
    </Layout>
  );
}

export default Index;
