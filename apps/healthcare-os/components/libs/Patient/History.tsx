import { Fragment, useState } from 'react';
import { Accordion, Badge, Field, Filter } from '@healthcareos/react';
import { helpers } from '@healthcare/utils';
import useSWR from 'swr';
import dayjs from 'dayjs';

import { usePatient, useStore } from '../../../hooks';
import { HistoryModel } from '../../../models/history';
import Investigation from './History/Investigation';
import Consultation from './History/Consultation';
import Prescription from './History/Prescription';
import Admission from './History/Admission';
import Dispense from './History/Dispense';
import Location from './History/Location';
import Allergy from './History/Allergy';
import Triage from './History/Triage';
import Vitals from './History/Vitals';
import Queue from './History/Queue';
import Print from './History/Print';
import Visit from './History/Visit';

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
  const { store } = useStore();

  /**
   * context
   */
  const { patient, updateHistory } = usePatient();

  /**
   * api
   */
  const { data, error } = useSWR<{ visits: HistoryModel[] }>(
    `/visit?patient=${patient?.id}`
  );

  /**
   * variables
   */
  const histories = data?.visits || [];

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
        {!data &&
          !error &&
          Array.from({ length: 2 }, (_, i) => (
            <div
              key={i}
              className="h-[174px] rounded-lg bg-neutral-100 animate-pulse"
            />
          ))}

        {data && (
          <>
            {!histories.length && <p>Patient has no history yet</p>}
            {histories.map((history, key) => (
              <Accordion.Item
                key={key}
                defaultOpen={key === 0}
                className="rounded-lg p-4 border border-gray-200"
                actions={
                  <>
                    {!history.end_date && (
                      <Badge variant="pending">Ongoing visitation</Badge>
                    )}
                  </>
                }
                header={
                  <p className="text-lg font-bold">
                    {dayjs(history.start_date).format('ddd, DD MMM. YYYY')}
                    {history.end_date &&
                      dayjs(history.end_date).format(' - ddd, DD MMM. YYYY')}
                  </p>
                }
              >
                <div
                  className={helpers.classNames(
                    'grid grid-cols-1',
                    'divide-y divider-gray-200'
                  )}
                >
                  {history.logs.map((i, key) => (
                    <Fragment key={key}>
                      {i.reference === 'vital' && (
                        <Vitals data={i} isOngoing={!history.end_date} />
                      )}

                      {i.reference === 'location' && <Location data={i} />}

                      {i.reference === 'consultation' && (
                        <Consultation data={i} isOngoing={!history.end_date} />
                      )}

                      {i.reference === 'allergy' && (
                        <Allergy data={i} isOngoing={!history.end_date} />
                      )}

                      {i.reference === 'queue' && <Queue data={i} />}

                      {i.reference === 'investigation' && (
                        <Investigation data={i} />
                      )}

                      {i.reference === 'end' && <Visit data={i} />}

                      {i.reference === 'triage' && <Triage data={i} />}

                      {i.reference === 'prescription' && (
                        <Prescription data={i} />
                      )}

                      {['admission', 'detention'].includes(i.reference) && (
                        <Admission data={i} />
                      )}

                      {i.reference === 'dispense' && <Dispense data={i} />}

                      {i.reference === 'dispense_print' && <Print data={i} />}
                    </Fragment>
                  ))}
                </div>
              </Accordion.Item>
            ))}
          </>
        )}
      </Accordion>
    </>
  );
}

export default History;
