import { useState } from 'react';
import { Accordion, Badge, Field, Filter } from '@healthcareos/react';

import { usePatient } from '../../../hooks';
import Investigation from './History/Investigation';
import Consultation from './History/Consultation';
import Vitals from './History/Vitals';

export function History() {
  /**
   * state
   */
  const [filters, setFilters] = useState<
    Partial<{ search: string; filter: string }>
  >({});

  /**
   * context
   */
  const { patient, setPatient } = usePatient();

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
            defaultOpen={i === 0}
            className="rounded-lg p-4 border border-gray-200"
            actions={
              <>
                {i === 0 && patient.in_visitation && (
                  <Badge variant="pending">Ongoing visitation</Badge>
                )}
              </>
            }
            header={<p className="text-lg font-bold">04 Jan. 2023</p>}
          >
            <div className="grid gap-2">
              <Vitals />
              <Consultation />
              <Investigation />
            </div>
          </Accordion.Item>
        ))}
      </Accordion>
    </>
  );
}

export default History;
