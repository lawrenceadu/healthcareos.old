import { ReactElement, useState } from 'react';
import { Modal, Tabs } from '@healthcareos/react';

import Index from './Allergies/Index';
import Add from './Allergies/Add';

export interface AllergiesProps {
  children: (props: { proceed: () => void }) => ReactElement;
}

export function Allergies({ children }: AllergiesProps) {
  /**
   * variables
   */
  const tabs = [
    { name: 'Allergies', slug: 'index', component: Index },
    { name: 'Add allergies', slug: 'add', component: Add },
  ];

  /**
   * state
   */
  const [show, setShow] = useState(false);
  const [tab, setTab] = useState(tabs[0].slug);

  return (
    <>
      {children({ proceed: () => setShow(true) })}

      <Modal show={show} onHide={() => setShow(false)} header="Allergies">
        <Tabs
          tabs={tabs}
          activeKey={tab}
          navClassName="px-6 pt-2"
          onSelect={(key) => setTab(key)}
          childProps={{ onHide: () => setShow(false), setTab }}
        />
      </Modal>
    </>
  );
}

export default Allergies;
