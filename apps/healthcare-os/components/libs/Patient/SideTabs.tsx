import React, { useState } from 'react';
import { Tabs } from '@healthcareos/react';

import Investigations from './Investigations';
import Consultation from './Consultation';
import Allergies from './Allergies';
import Dispense from './Dispense';
import Vitals from './Vitals';

export function SideTabs() {
  /**
   * variables
   */
  const tabs = [
    { name: 'Vitals', slug: 'vitals', component: Vitals },
    {
      name: 'Consultation',
      slug: 'consultation',
      component: Consultation,
    },
    {
      name: 'Investigation',
      slug: 'investigation',
      component: Investigations,
    },
    { name: 'Dispense', slug: 'dispense', component: Dispense },
    { name: 'Allergies', slug: 'allergies', component: Allergies },
  ];

  /**
   * state
   */
  const [tab, setTab] = useState(tabs[0].slug);

  return (
    <Tabs
      tabs={tabs}
      activeKey={tab}
      navClassName="sticky top-0 z-[1] bg-white"
      onSelect={(key) => setTab(String(key))}
    />
  );
}

export default SideTabs;
