import { Accordion, Badge } from '@healthcareos/react';
import { startCase } from 'lodash';
import dayjs from 'dayjs';

import { HistoryLog, QueueHistoryModel } from '../../../../models/history';

export interface QueueProps {
  data: Omit<HistoryLog, 'details'> & { details: QueueHistoryModel };
}

function Queue({ data }: QueueProps) {
  /**
   * variables
   */
  const items = [
    { label: 'Reference', value: startCase(data.reference) },
    { label: 'Added by', value: data.created_by.name || '--' },
    {
      label: 'Added at',
      value: dayjs(data.created_at).format('ddd DD, MMM YYYY @ hh:mma'),
    },
  ];

  return (
    <Accordion.Item
      className="py-2"
      header={
        <>
          <Badge className="bg-orange-50 text-orange-600">
            {startCase(data.reference)}
          </Badge>
          <p className="text-sm font-bold mt-1">
            {startCase(data.details.location.name)}
          </p>
        </>
      }
    >
      <div className="flex flex-col pb-2 border-b border-gray-200">
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

export default Queue;
