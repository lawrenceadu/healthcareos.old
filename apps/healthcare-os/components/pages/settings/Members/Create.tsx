import { useState } from 'react';
import { Modal, Tabs } from '@healthcareos/react';

import Upload from './Create/Upload';
import Add from './Create/Add';

export interface CreateProps {
  mutate: () => void;
  children: (props: { proceed: () => void }) => void;
}

function Create({ mutate, children }: CreateProps) {
  /**
   * variables
   */
  const tabs = [
    { name: 'Email', slug: 'email', component: Add },
    { name: 'Using csv file', slug: 'upload', component: Upload },
  ];

  /**
   * state
   */
  const [show, setShow] = useState(false);
  const [tab, setTab] = useState(tabs[0].slug);

  return (
    <>
      {children({ proceed: () => setShow(true) })}

      <Modal show={show} onHide={() => setShow(false)} header="Invite member">
        <Tabs
          tabs={tabs}
          activeKey={tab}
          navClassName="px-6 mt-4"
          onSelect={(key) => setTab(key)}
          childProps={{ mutate, onHide: () => setShow(false) }}
        />
      </Modal>
    </>
  );
}

export default Create;
