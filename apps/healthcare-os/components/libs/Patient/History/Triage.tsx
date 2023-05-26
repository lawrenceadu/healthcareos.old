import { Accordion, Badge } from '@healthcareos/react';
import { startCase } from 'lodash';
import dayjs from 'dayjs';

import { HistoryLog, TriageHistoryModel } from '../../../../models/history';

export interface Triage {
  data: Omit<HistoryLog, 'details'> & { details: TriageHistoryModel };
}

function Triage({ data }: Triage) {
  /**
   * variables
   */
  const items = [
    { label: 'Triage', value: startCase(data.details.name) },
    { label: 'Assigned by', value: data.created_by.name || '--' },
    {
      label: 'Assigned at',
      value: dayjs(data.created_at).format('ddd DD, MMM YYYY @ hh:mma'),
    },
  ];

  return (
    <Accordion.Item
      className="py-2"
      header={
        <>
          <Badge className="bg-pink-50 text-pink-600">
            {startCase(data.reference)}
          </Badge>
          <p className="text-sm font-bold mt-1">
            {startCase(data.details.name)}
          </p>
        </>
      }
    >
      <div className="flex flex-col">
        {items.map((i, key) => (
          <div className="flex gap-4" key={key}>
            <div className="flex-[0_0_120px]">
              <small className="text-muted text-sm font-medium">
                {i.label}:
              </small>
            </div>
            <small className="text-sm">{i.value}</small>
          </div>
        ))}
      </div>
    </Accordion.Item>
  );
}

export default Triage;
