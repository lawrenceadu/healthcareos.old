import { ReactElement, useState } from 'react';
import { Modal, Tabs } from '@healthcareos/react';

import { usePermissions } from '../../../hooks';
import Investigation from './Investigations/Investigation';
import Submit from './Investigations/Submit';
import Index from './Investigations/Index';
import Add from './Investigations/Add';

export interface MedicationProps {
  children: (props: { proceed: () => void }) => ReactElement;
}

function Investigations({ children }: MedicationProps) {
  /**
   * perm
   */
  const [canView, canAdd] = usePermissions(
    'investigationrequest_view',
    'investigationrequest_add'
  );

  /**
   * variables
   */
  const tabs = [
    ...(canView
      ? [{ name: 'Investigations', slug: 'index', component: Index }]
      : []),
    ...(canAdd
      ? [{ name: 'Request investigation', slug: 'add', component: Add }]
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
        header="Investigation"
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

export default Object.assign(Investigations, {
  Investigation,
  Submit,
  Index,
  Add,
});
