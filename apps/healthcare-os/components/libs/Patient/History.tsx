import { useState } from 'react';
import { Accordion, Field, Filter } from '@healthcareos/react';

import Investigation from './History/Investigation';

export function History() {
  /**
   * state
   */
  const [filters, setFilters] = useState<
    Partial<{ search: string; filter: string }>
  >({});

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
            { label: 'Consultation', value: 'consultation' },
            { label: 'Investigation', value: 'investigation' },
            { label: 'Inpatient', value: 'inpatient' },
            { label: 'Outpatient', value: 'outpatient' },
            { label: 'Prescription', value: 'prescription' },
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
            className="rounded-lg p-4 border border-gray-200"
            header={<p className="text-lg font-bold">04 Jan. 2023</p>}
          >
            <Investigation />
          </Accordion.Item>
        ))}
      </Accordion>
    </>
  );
}

export default History;
