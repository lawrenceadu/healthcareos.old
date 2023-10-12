import { useState } from 'react';
import { useRouter } from 'next/router';
import { Tabs } from '@healthcareos/react';
import useSWR from 'swr';

import { InsuranceClaimModel } from '../../../models';
import { useStore } from '../../../hooks';

import Details from '../../../components/pages/insurance/details/Index';
import Layout from '../../../components/libs/Layout';
import Claim from '../../../components/pages/insurance/details/Claim';

function Page() {
  /**
   * routes
   */
  const router = useRouter();
  const { id } = router.query;

  /**
   * state
   */
  const [tab, setTab] = useState('details');

  /**
   * store
   */
  const { store } = useStore();

  /**
   * api
   */
  const { data, mutate } = useSWR<{
    claim: InsuranceClaimModel & { claim: InsuranceClaimModel };
  }>(`/insurance/claim/visit/${id}`);

  /**
   * variables
   */
  const isPending = data?.claim?.status === 'pending';

  const claim = data?.claim;
  const visit = claim?.visit;
  const patient = claim?.patient;
  const currency = store?.facility?.currency_symbol;
  const insurance = claim?.insurance;

  const diagnoses = isPending ? visit.diagnoses : claim?.claim?.diagnoses;
  const invoices = isPending ? visit.invoices : claim?.claim?.invoices;
  const procedures = isPending ? visit.procedures : claim?.claim?.procedures; // prettier-ignore
  const investigations = isPending ? visit.investigations : claim?.claim?.investigations // prettier-ignore
  const medicines = isPending ? visit.medicines : claim?.claim?.medicines;
  const histories = !isPending ? data?.claim?.claim?.history : [];

  const tabs = [
    { name: 'Details', slug: 'details', component: Details },
    { name: 'Claim', slug: 'claim', component: Claim },
  ];

  return (
    <Layout title="Claims details" onBack={() => router.back()}>
      <Tabs
        tabs={tabs}
        activeKey={tab}
        onSelect={(key) => setTab(key)}
        navClassName="sticky top-[56px] md:top-[4.5rem] bg-white z-10"
        childProps={{
          claim,
          visit,
          patient,
          currency,
          invoices,
          isPending,
          diagnoses,
          histories,
          insurance,
          medicines,
          procedures,
          investigations,
          mutate,
          setTab,
        }}
      />
    </Layout>
  );
}

export default Page;
