import { useState } from 'react';
import { Tabs } from '@healthcareos/react';

import { usePermissions } from '../../../hooks';
import Onboarding from '../Onboarding';

export function Edit() {
  /**
   * perm
   */
  const [canEdit] = usePermissions('patient_edit');

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
    <>
      {canEdit && (
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
      )}

      {!canEdit && (
        <p className="text-center">
          You don&apos;t have permission to edit patient
        </p>
      )}
    </>
  );
}

export default Edit;
