import { Accordion, Badge } from '@healthcareos/react';
import dayjs from 'dayjs';

import { AdmissionModel } from '../../../../models';
import { HistoryLog } from '../../../../models/history';
import { startCase } from 'lodash';
import { helpers } from '@healthcare/utils';

export interface AdmissionProps {
  data: Omit<HistoryLog, 'details'> & { details: AdmissionModel };
}

export function Admission({ data: { details, ...data } }: AdmissionProps) {
  /**
   * variables
   */
  const items = [
    [
      {
        label:
          details.type === 'admit'
            ? 'Admission diagnosis'
            : 'Detention diagnosis',
        value: details.diagnoses.map((i) => i.name).join(', '),
      },
      {
        label: details.type === 'admit' ? 'Admitted by' : 'Detained by',
        value: details.created_by.name,
      },
      {
        label: details.type === 'admit' ? 'Admission date' : 'Detention date',
        value: dayjs(details.created_at).format('ddd DD, MMM YYYY'),
      },
      { label: 'Department', value: details.department.name },
      { label: 'Ward', value: details.ward.name },
      { label: 'Bed', value: details.bed },
      {
        label: details.type === 'admit' ? 'Admission notes' : 'Detention notes',
        value: details.notes,
      },
    ],
    [
      {
        label: 'Discharge diagnosis',
        value: details.discharge_diagnoses
          ? details.discharge_diagnoses.map((i) => i.name).join(', ')
          : '',
      },
      {
        label: 'Discharged by',
        value: details.discharged_by?.name,
      },
      {
        label: 'Discharge date',
        value: details.end_date
          ? dayjs(details.end_date).format('ddd DD, MMM YYYY')
          : null,
      },
      {
        label: 'Outcome',
        value: startCase(details?.outcome || ''),
      },
      {
        label: 'Discharge note',
        value: details?.discharge_note,
      },
    ],
  ];

  return (
    <Accordion.Item
      className="py-2"
      header={
        <>
          <Badge className="bg-sky-50 text-sky-600">
            {details.type === 'admit' ? 'Admission' : 'Detention'}
          </Badge>
          <p className="text-sm font-bold mt-1">{data.description}</p>
        </>
      }
    >
      <div
        className={helpers.classNames(
          '-mt-2',
          'grid grid-cols-1',
          'divide-y divide-neutral-100'
        )}
      >
        {items.map((items, key) => (
          <div key={key} className="flex flex-col py-2">
            {items.map((i, key) => {
              return (
                i.value && (
                  <div className="flex gap-4" key={key}>
                    <div className="flex-[0_0_144px]">
                      <small className="text-muted text-sm font-medium">
                        {i.label}:
                      </small>
                    </div>
                    <small className="text-sm">{i.value}</small>
                  </div>
                )
              );
            })}
          </div>
        ))}
      </div>
    </Accordion.Item>
  );
}

export default Admission;
