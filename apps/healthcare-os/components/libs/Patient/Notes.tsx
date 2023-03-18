import { useState } from 'react';
import { Accordion, Button, Field, Filter } from '@healthcareos/react';
import { PlusIcon } from '@healthcare/icons';
import { helpers } from '@healthcare/utils';

import AddForm from './Notes/Add';
import Float from '../Float';

export function Notes() {
  /**
   * state
   */
  const [filters, setFilters] = useState<
    Partial<{ search: string; filter: string }>
  >({});

  /**
   * variables
   */
  const items = [
    { label: 'Added by', value: 'Doctor Fred Osei' },
    { label: 'Added on', value: '04 jan. 2023 04:30 pm' },
    {
      label: 'Notes',
      value:
        'This patient is being detain so we can conduct further investigations. ',
    },
  ];

  return (
    <>
      <div className="flex gap-4 items-center mb-6">
        <Field.Search
          onSearch={(key) => setFilters({ ...filters, search: key })}
        />
        <Filter.Dropdown
          label="Filters"
          value={filters?.filter}
          options={[
            { label: 'Doctor', value: 'doctor' },
            { label: 'Nurse', value: 'nurse' },
            { label: 'All notes', value: 'all' },
          ]}
          onClick={({ value }: { value: string }) =>
            setFilters({ ...filters, filter: value })
          }
        />
      </div>

      <Accordion className="flex flex-col gap-4">
        {Array.from({ length: 3 }, (_, i) => (
          <Accordion.Item
            key={i}
            defaultOpen={i === 0}
            className="rounded-lg p-4 border border-gray-200"
            header={<p className="text-lg font-bold">04 Jan. 2023</p>}
          >
            <div className="grid gap-2 font-medium">
              <p className="text-xs text-green-700">Doctor</p>
              {items.map((i, key) => (
                <div key={key}>
                  <small className="text-gray-600 block">{i.label}</small>
                  <small>{i.value}</small>
                </div>
              ))}
            </div>
          </Accordion.Item>
        ))}
      </Accordion>

      <Float>
        <AddForm>
          {({ proceed }) => (
            <Button
              onClick={() => proceed()}
              className={helpers.classNames('btn-primary')}
            >
              <PlusIcon />
              <span>Add notes</span>
            </Button>
          )}
        </AddForm>
      </Float>
    </>
  );
}

export default Notes;
