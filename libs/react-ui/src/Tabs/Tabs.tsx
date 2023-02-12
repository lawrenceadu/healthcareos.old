import { ComponentType } from 'react';
import { Nav, Tabs, TabsProps } from '@restart/ui';
import { helpers } from '@healthcare/utils';

import { Tab } from './Components/Tab';

export interface LocalTabsProps extends Omit<TabsProps, 'onSelect'> {
  tabs: { name: string; slug: string; component: ComponentType }[];
  childProps?: { [x: string]: unknown };
  navClassName?: string;
  onSelect: (key: string) => void;
}

export default function ({
  tabs,
  onSelect,
  activeKey,
  childProps,
  navClassName,
  ...props
}: LocalTabsProps) {
  /**
   * variables
   */
  const tab = tabs.find((i) => i.slug === activeKey);

  return (
    <Tabs {...{ activeKey, ...props }}>
      <Nav
        onSelect={(key) => onSelect(String(key))}
        className={helpers.classNames(
          navClassName,
          'w-full overflow-x-auto mb-6',
          'flex flex-nowrap gap-6 whitespace-nowrap'
        )}
      >
        {tabs.map((tab, key) => (
          <Tab eventKey={tab.slug} key={key}>
            {tab.name}
          </Tab>
        ))}
      </Nav>
      <div>{tab && <tab.component {...childProps} />}</div>
    </Tabs>
  );
}
