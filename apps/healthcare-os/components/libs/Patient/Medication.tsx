import React, { ReactElement, useState } from 'react';
import { Modal, Tabs } from '@healthcareos/react';

import { usePermissions } from '../../../hooks';
import Index from './Medication/Index';
import Add from './Medication/Add';

export interface MedicationProps {
  children: (props: { proceed: () => void }) => ReactElement;
}

function Medication({ children }: MedicationProps) {
  /**
   * perm
   */
  const [canView, canAdd] = usePermissions(
    'prescription_view',
    'prescription_add'
  );

  /**
   * variables
   */
  const tabs = [
    ...(canView
      ? [{ name: 'Medications', slug: 'index', component: Index }]
      : []),
    ...(canAdd
      ? [{ name: 'Add prescription', slug: 'add', component: Add }]
      : []),
  ];

  /**
   * state
   */
  const [tab, setTab] = useState(tabs[0].slug);
  const [show, setShow] = useState(false);

  return (
    <>
      {children({ proceed: () => setShow(true) })}

      <Modal
        show={show}
        onHide={() => setShow(false)}
        header="Medication"
        size="xl"
      >
        <div className="max-h-[600px] overflow-y-auto">
          <Tabs
            tabs={tabs}
            activeKey={tab}
            navClassName="px-6 pt-2"
            onSelect={(key) => setTab(key)}
            childProps={{ onHide: () => setShow(false), setTab }}
          />
        </div>
      </Modal>
    </>
  );
}

export default Medication;
