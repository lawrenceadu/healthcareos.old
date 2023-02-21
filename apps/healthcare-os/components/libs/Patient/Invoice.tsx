import { useState } from 'react';
import { Accordion, Badge, Button, Field, Filter } from '@healthcareos/react';
import { PlusIcon } from '@healthcare/icons';
import { helpers } from '@healthcare/utils';

import AddForm from './Invoice/Add';

export function Invoice() {
  /**
   * state
   */
  const [filters, setFilters] = useState<
    Partial<{ search: string; filter: string }>
  >({});

  return (
    <div>
      <div className="flex gap-4 items-center mb-6">
        <Field.Search
          onSearch={(key) => setFilters({ ...filters, search: key })}
        />
        <Filter.Dropdown
          label="Filters"
          value={filters?.filter}
          options={[{ label: 'Outpatient', value: 'outpatient' }]}
          onClick={({ value }: { value: string }) =>
            setFilters({ ...filters, filter: value })
          }
        />
      </div>

      <Accordion className="flex flex-col gap-4">
        {Array.from({ length: 3 }, (_, i) => (
          <Accordion.Item
            key={i}
            className="rounded-lg p-4 border border-gray-200"
            actions={<Badge variant="light">Draft</Badge>}
            header={
              <p className="text-lg font-bold">Invoice HMS-1281-012023</p>
            }
          ></Accordion.Item>
        ))}
      </Accordion>

      <AddForm>
        {({ proceed }) => (
          <Button
            onClick={() => proceed()}
            className={helpers.classNames(
              'btn-primary !rounded-full',
              'fixed bottom-4 md:right-[3rem] xl:right-[544px]'
            )}
          >
            <PlusIcon />
            <span>Create invoice</span>
          </Button>
        )}
      </AddForm>
    </div>
  );
}

export default Invoice;
