import { Accordion, Badge } from '@healthcareos/react';
import { startCase } from 'lodash';
import dayjs from 'dayjs';

import { HistoryLog, PrescriptionHistoryModel } from '../../../../models/history'; // prettier-ignore

export interface PrescriptionProps {
  data: Omit<HistoryLog, 'details'> & { details: PrescriptionHistoryModel };
}

function Prescription({ data }: PrescriptionProps) {
  /**
   * variables
   */
  const items = [
    { label: 'Prescribed by', value: data.created_by.name || '--' },
    {
      label: 'Prescribed at',
      value: dayjs(data.created_at).format('ddd DD, MMM YYYY @ hh:mma'),
    },
  ];

  return (
    <Accordion.Item
      className="py-2"
      header={
        <>
          <Badge className="bg-blue-50 text-blue-600">
            {startCase(data.reference)}
          </Badge>
          <p className="text-sm font-bold mt-1">
            {data.details.medicines.map((i) => i.medicine.name).join(', ')}
          </p>
        </>
      }
    >
      <div className="flex flex-col">
        <div className="flex">
          <div className="flex-[0_0_120px]">
            <small className="text-muted text-sm">Medicines:</small>
          </div>
          <div className="text-sm overflow-x-auto">
            <table>
              <thead>
                <tr>
                  <th>Medicine</th>
                  <th>Dose</th>
                  <th>Route</th>
                  <th>Schedule</th>
                  <th>Start date</th>
                  <th>Stop date</th>
                  <th>Administration time</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {data.details.medicines.map((medicine, key) => (
                  <tr key={key}>
                    <td>{medicine.medicine.name}</td>
                    <td>
                      {medicine.dose && medicine.unit
                        ? `${medicine.dose}${medicine.unit}`
                        : '--'}
                    </td>
                    <td>{medicine.route || '--'}</td>
                    <td>{medicine.schedule}</td>
                    <td>
                      {medicine.start_date
                        ? dayjs(medicine.start_date).format('DD/MM/YY')
                        : '--'}
                    </td>
                    <td>
                      {medicine.stop_date
                        ? dayjs(medicine.stop_date).format('DD/MM/YY')
                        : '--'}
                    </td>
                    <td>
                      {medicine.administration_time.length
                        ? medicine.administration_time.join(', ')
                        : '--'}
                    </td>
                    <td>{medicine.notes || '--'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
