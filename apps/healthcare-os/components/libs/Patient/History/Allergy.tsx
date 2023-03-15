import { Accordion } from '@healthcareos/react';

import { AllergyModel } from '../../../../models';
import { HistoryLog } from '../../../../models/history';
import dayjs from 'dayjs';

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
      className="px-2"
      header={
        <>
          <p className="text-xs !text-green-700">Investigation</p>
          <p className="text-sm font-bold">{data.description}</p>
        </>
      }
    >
      <div className="flex flex-col pb-2 border-b border-gray-200">
        {items.map((i, key) => (
          <div className="flex gap-4" key={key}>
            <div className="flex-[0_0_144px]">
              <small className="text-muted text-sm">{i.label}:</small>
            </div>
            <small className="text-sm">{i.value}</small>
          </div>
        ))}
      </div>
    </Accordion.Item>
  );
}

export default Allergy;
