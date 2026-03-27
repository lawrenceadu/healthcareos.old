import { Accordion, Badge } from '@healthcareos/react';
import dayjs from 'dayjs';

import { HistoryLog, PrescriptionPrintModel } from '../../../../models'; // prettier-ignore

export interface PrintProps {
  data: Omit<HistoryLog, 'details'> & { details: PrescriptionPrintModel };
}

function Prescription({ data }: PrintProps) {
  /**
   * variables
   */
  const items = [
    { label: 'Printed by', value: data.created_by.name || '--' },
    {
      label: 'Printed at',
      value: dayjs(data.created_at).format('ddd DD, MMM YYYY @ hh:mma'),
    },
  ];

  return (
    <Accordion.Item
      className="py-2"
      header={
        <>
          <Badge className="bg-indigo-50 text-indigo-600">
            Prescription print
          </Badge>
          <p className="text-sm font-bold mt-1">
            {data.details.details.map((i) => i.medicine.name).join(', ')}
          </p>
        </>
      }
    >
      <div className="flex flex-col">
        <div className="flex">
          <div className="flex-[0_0_120px]">
            <small className="text-muted text-sm font-medium">File:</small>
          </div>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={data.details.file}
            className="text-sm underline text-blue-700"
          >
            View attachment
          </a>
        </div>
        {items.map((i, key) => (
          <div className="flex" key={key}>
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

export default Prescription;
