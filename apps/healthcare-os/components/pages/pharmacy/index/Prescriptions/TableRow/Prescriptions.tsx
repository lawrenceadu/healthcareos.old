import { startCase } from 'lodash';
import { Badge } from '@healthcareos/react';
import dayjs from 'dayjs';

import { PrescriptionModel } from '../../../../../../models/medicine';

function Prescriptions({ prescription }: { prescription: PrescriptionModel }) {
  return (
    <div className="p-6">
      <p className="mb-4 font-bold">Prescriptions</p>
      <div className="overflow-x-auto">
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
            {prescription.medicines.map((medicine, key) => (
              <tr key={key}>
                <td>{medicine.medicine.name}</td>
                <td>
                  {medicine.dose && medicine.unit
                    ? `${medicine.dose} ${medicine.unit}`
                    : '--'}
                </td>
                <td>{startCase(medicine.route || '--')}</td>
                <td>{startCase(medicine.schedule)}</td>
                <td>
                  {medicine.start_date
                    ? dayjs(medicine.start_date).format('ddd DD, MMM YYYY')
                    : '--'}
                </td>
                <td>
                  {medicine.stop_date
                    ? dayjs(medicine.stop_date).format('ddd DD, MMM YYYY')
                    : '--'}
                </td>
                <td>
                  <div className="flex flex-wrap gap-2">
                    {medicine.administration_time.length
                      ? medicine.administration_time.map((i, key) => {
                          const times = i.split(':');
                          const date = dayjs()
                            .set('hour', Number(times[0]))
                            .set('minute', Number(times[1]))
                            .format('h:mm a');

                          return (
                            <Badge variant="light" key={key}>
                              {date}
                            </Badge>
                          );
                        })
                      : '--'}
                  </div>
                </td>
                <td>{medicine.notes || '--'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Prescriptions;
