import React, { useState } from 'react';
import { Tabs } from '@healthcareos/react';
import Onboarding from '../Onboarding';

export function Edit() {
  /**
   * variables
   */
  const tabs = [
    { name: 'Patient Details', slug: 'details', component: Onboarding.Details },
    { name: 'Contact', slug: 'contact', component: Onboarding.Contact },
    { name: 'Insurance', slug: 'insurance', component: Onboarding.Insurance },
    { name: 'Address', slug: 'address', component: Onboarding.Address },
    { name: 'Next of Kin', slug: 'kin', component: Onboarding.Kin },
    {
      name: 'Additional Information',
      slug: 'additional',
      component: Onboarding.AdditionalInfo,
    },
  ];

  /**
   * state
   */
  const [tab, setTab] = useState(tabs[0].slug);

  return (
    <Tabs
      tabs={tabs}
      activeKey={tab}
      onSelect={(key) => setTab(String(key))}
      childProps={{
        params: {},
        button: 'Save changes',
        onSubmit: (params, { setSubmitting }) => {
          return;
        },
      }}
    />
  );
}

export default Edit;
