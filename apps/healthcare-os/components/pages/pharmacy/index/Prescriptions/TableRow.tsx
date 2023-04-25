import { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon, DotsHorizIcon } from '@healthcare/icons'; // prettier-ignore
import { Badge, Dropdown, Fade } from '@healthcareos/react';
import { useRouter } from 'next/router';
import { startCase } from 'lodash';
import { helpers } from '@healthcare/utils';
import { motion } from 'framer-motion';
import dayjs from 'dayjs';

import { PrescriptionModel } from '../../../../../models';
import { usePermissions } from '../../../../../hooks';
import Dispense from './Dispense';
import routes from '../../../../../routes';

export interface TableRowProps {
  mutate: () => void;
  prescription: PrescriptionModel;
}

function TableRow({ mutate, prescription }: TableRowProps) {
  /**
   * state
   */
  const [toggle, setToggle] = useState(false);

  /**
   * perm
   */
  const [canEdit] = usePermissions('prescription_edit');

  /**
   * routes
   */
  const router = useRouter();

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
          <Badge variant={prescription.status}>{prescription.status}</Badge>
        </td>
        <td onClick={(e) => e.stopPropagation()}>
          <Dropdown>
            <Dropdown.Toggle className="mx-auto">
              <DotsHorizIcon />
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {canEdit && prescription.status === 'pending' && (
                <Dispense {...{ prescription, mutate }}>
                  {({ proceed }) => (
                    <Dropdown.Item onClick={() => proceed()}>
                      Dispense medication
                    </Dropdown.Item>
                  )}
                </Dispense>
              )}
              <Dropdown.Item
                onClick={() =>
                  router.push(
                    routes.dashboard.patients.details.index
                      .replace('[id]', prescription.patient.id)
                      .replace('[tab]', 'history')
                  )
                }
              >
                View patient
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </td>
      </tr>

      <Fade as={motion.tr} show={toggle} className="bg-white z-[10]">
        <td colSpan={9} className="!p-0">
          <div className="overflow-x-auto">
            <table className="mb-8">
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
                    <td>{`${medicine.dose} ${medicine.unit}`}</td>
                    <td>{startCase(medicine.route)}</td>
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
        </td>
      </Fade>
    </>
  );
}

export default TableRow;
