import { Accordion, Badge } from '@healthcareos/react';
import dayjs from 'dayjs';

import { HistoryLog } from '../../../../models/history';

export interface VisitProps {
  data: Omit<HistoryLog, 'details'>;
}

function Visit({ data }: VisitProps) {
  /**
   * variables
   */
  const items = [
    { label: 'Ended by', value: data.created_by.name || '--' },
    {
      label: 'Ended at',
      value: dayjs(data.created_at).format('ddd DD, MMM YYYY @ hh:mma'),
    },
  ];

  return (
    <Accordion.Item
      className="py-2"
      header={<Badge className="bg-teal-50 text-teal-600">Visit ended</Badge>}
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

export default Visit;
