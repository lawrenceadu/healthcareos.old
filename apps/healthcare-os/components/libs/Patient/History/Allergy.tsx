import { Accordion, Badge } from '@healthcareos/react';
import dayjs from 'dayjs';

import { AllergyModel } from '../../../../models';
import { HistoryLog } from '../../../../models/history';

export interface AllergyProps {
  data: Omit<HistoryLog, 'details'> & { details: AllergyModel };
  isOngoing: boolean;
}

export function Allergy({ data }: AllergyProps) {
  /**
   * variables
   */
  const items = [
    { label: 'Symptoms', value: data.details.symptoms },
    { label: 'Severity of reaction', value: data.details.severity_of_reaction },
    { label: 'Notes', value: data.details.notes },
    { label: 'Added by', value: data.created_by.name },
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
          <Badge className="bg-yellow-50 text-yellow-600">Allery</Badge>
          <p className="text-sm font-bold mt-1">{data.details.symptoms}</p>
        </>
      }
    >
      <div className="flex flex-col">
        {items.map((i, key) => (
          <div className="flex gap-4" key={key}>
            <div className="flex-[0_0_144px]">
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

export default Allergy;
