import { useState } from 'react';
import { Modal, Tabs } from '@healthcareos/react';

import Upload from './Create/Upload';
import Add from './Create/Add';

export interface CreateProps {
  children: (props: { proceed: () => void }) => void;
}

function Create({ children }: CreateProps) {
  /**
   * variables
   */
  const tabs = [
    { name: 'Add location', slug: 'add', component: Add },
    { name: 'Using csv file', slug: 'upload', component: Upload },
  ];

  /**
   * state
   */
  const [state, setState] = useState(false);
  const [tab, setTab] = useState(tabs[0].slug);

  return (
    <>
      {children({ proceed: () => setState(true) })}

      <Modal show={state} onHide={() => setState(false)} header="Add location">
        <Tabs
          tabs={tabs}
          activeKey={tab}
          navClassName="px-6 mt-4"
          onSelect={(key) => setTab(key)}
        />
      </Modal>
    </>
  );
}

export default Create;
