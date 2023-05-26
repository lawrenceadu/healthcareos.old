import { Accordion, Badge } from '@healthcareos/react';
import { startCase } from 'lodash';
import dayjs from 'dayjs';

import { HistoryLog, LocationHistoryModel } from '../../../../models/history';

export interface LocationProps {
  data: Omit<HistoryLog, 'details'> & { details: LocationHistoryModel };
}

function Location({ data }: LocationProps) {
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
          <Badge className="bg-gray-100 text-gray-700">
            {startCase(data.reference)}
          </Badge>
          <p className="text-sm font-bold">{startCase(data.details.name)}</p>
        </>
      }
    >
      <div className="flex flex-col">
        {items.map((i, key) => (
          <div className="flex gap-4" key={key}>
            <div className="flex-[0_0_120px]">
              <small className="text-muted text-sm">{i.label}:</small>
            </div>
            <small className="text-sm">{i.value}</small>
          </div>
        ))}
      </div>
    </Accordion.Item>
  );
}

export default Location;
