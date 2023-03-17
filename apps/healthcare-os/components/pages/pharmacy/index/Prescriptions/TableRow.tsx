import { helpers } from '@healthcare/utils';
import { PrescriptionModel } from '../../../../../models';
import { useState } from 'react';
import {
  ChevronDownIcon,
  ChevronUpIcon,
  DotsHorizIcon,
} from '@healthcare/icons';
import dayjs from 'dayjs';
import { Badge, Dropdown } from '@healthcareos/react';
import { startCase } from 'lodash';

export interface TableRowProps {
  mutate: () => void;
  prescription: PrescriptionModel;
}

function TableRow({ mutate, prescription }: TableRowProps) {
  /**
   * state
   */
  const [toggle, setToggle] = useState(false);

  return (
    <>
      <tr
        role="button"
        className={helpers.classNames(toggle && 'bg-gray-50')}
        onClick={() => setToggle(!toggle)}
      >
        <td className="flex gap-2 items-center">
          {toggle ? <ChevronUpIcon size={20} /> : <ChevronDownIcon size={20} />}
          <span>{prescription.patient.name}</span>
        </td>
        <td>
          <div className="max-w-[248px] truncate">
            {prescription.medicines.map((i) => i.medicine.name).join(', ')}
          </div>
        </td>
        <td>{prescription.created_by.name}</td>
        <td>{dayjs(prescription.created_at).format('ddd DD, MMM YYYY')}</td>
        <td>
          <Badge variant="pending">pending</Badge>
        </td>
        <td onClick={(e) => e.stopPropagation()}>
          <Dropdown>
            <Dropdown.Toggle className="mx-auto">
              <DotsHorizIcon />
            </Dropdown.Toggle>
            <Dropdown.Menu></Dropdown.Menu>
          </Dropdown>
        </td>
      </tr>

      {toggle && (
        <>
          <tr>
            <td colSpan={9} className="!p-0">
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
                  </tr>
                </thead>
                <tbody>
                  {prescription.medicines.map((medicine, key) => (
                    <tr key={key}>
                      <td>{medicine.medicine.name}</td>
                      <td>{`${medicine.dose} ${medicine.unit}`}</td>
                      <td>{startCase(medicine.route)}</td>
                      <td>{startCase(medicine.schedule)}</td>
                      <td>
                        {medicine.start_date
                          ? dayjs(medicine.start_date).format(
                              'ddd DD, MMM YYYY'
                            )
                          : '--'}
                      </td>
                      <td>
                        {medicine.stop_date
                          ? dayjs(medicine.stop_date).format('ddd DD, MMM YYYY')
                          : '--'}
                      </td>
                      <td>
                        {medicine.administration_time.length
                          ? medicine.administration_time
                              .map((i) => {
                                const times = i.split(':');
                                return dayjs()
                                  .set('hour', Number(times[0]))
                                  .set('minute', Number(times[1]))
                                  .format('h:mm a');
                              })
                              .join(', ')
                          : '--'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </td>
          </tr>
          {prescription.notes && (
            <tr>
              <td colSpan={8} className="!whitespace-normal">
                <p className="font-medium">Notes:</p>
                <p>{prescription.notes}</p>
              </td>
            </tr>
          )}
        </>
      )}
    </>
  );
}

export default TableRow;
