import { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon, DotsHorizIcon } from '@healthcare/icons'; // prettier-ignore
import { Badge, Dropdown, Fade } from '@healthcareos/react';
import { useRouter } from 'next/router';
import { startCase } from 'lodash';
import { helpers } from '@healthcare/utils';
import { motion } from 'framer-motion';
import useSWR from 'swr';
import dayjs from 'dayjs';

import { PrescriptionModel, PrescriptionPrintModel } from '../../../../../models'; // prettier-ignore
import { usePermissions } from '../../../../../hooks';
import Dispense from './Dispense';
import routes from '../../../../../routes';
import Print from './Print';

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
  const [canEdit, canViewPatient] = usePermissions('dispense_edit', 'patient');

  /**
   * routes
   */
  const router = useRouter();

  /**
   * api
   */
  const { data: printsData } = useSWR<{ prints: PrescriptionPrintModel[] }>(
    toggle && !!prescription.prints && `/prescription/${prescription.id}/print`
  );

  /**
   * variables
   */
  const prints = printsData?.prints || [];

  return (
    <>
      <tr
        role="button"
        onClick={() => setToggle(!toggle)}
        className={helpers.classNames(toggle && 'bg-gray-50')}
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
          <div className="flex gap-2">
            <Badge variant={prescription.status}>{prescription.status}</Badge>
            {prescription.status !== 'printed' && !!prescription.prints && (
              <Badge variant="printed">printed</Badge>
            )}
          </div>
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

              {canEdit && prescription.status !== 'printed' && (
                <Print {...{ prescription, mutate }}>
                  {({ proceed }) => (
                    <Dropdown.Item onClick={() => proceed()}>
                      Print prescription
                    </Dropdown.Item>
                  )}
                </Print>
              )}

              {canViewPatient && (
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
              )}
            </Dropdown.Menu>
          </Dropdown>
        </td>
      </tr>

      <Fade as={motion.tr} show={toggle} className="bg-white z-[10]">
        <td colSpan={9} className="!p-0">
          <div
            className={helpers.classNames(
              'mb-8',
              'divide-y divide-gray-200',
              'border-x border-b border-gray-200'
            )}
          >
            <div className="p-6">
              <p className="mb-4 font-bold">Medicines</p>
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
                            ? dayjs(medicine.start_date).format(
                                'ddd DD, MMM YYYY'
                              )
                            : '--'}
                        </td>
                        <td>
                          {medicine.stop_date
                            ? dayjs(medicine.stop_date).format(
                                'ddd DD, MMM YYYY'
                              )
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

            {!!prints.length && (
              <div className="p-6">
                <p className="mb-4 font-bold">Print History</p>
                <div className="overflow-x-auto">
                  <table>
                    <thead>
                      <tr>
                        <th>Printed by</th>
                        <th>Printed at</th>
                        <th>Medicines</th>
                        <th>File</th>
                      </tr>
                    </thead>
                    <tbody>
                      {prints.map((print, key) => (
                        <tr key={key}>
                          <td>{print.created_by.name}</td>
                          <td>
                            {dayjs(print.created_at).format(
                              'DD MMM, YYYY @ h:mm a'
                            )}
                          </td>
                          <td>
                            {print.details
                              .map(({ medicine }) => medicine.name)
                              .join(', ')}
                          </td>
                          <td>
                            <a
                              target="_blank"
                              href={print.file}
                              className="text-blue-600"
                              rel="noopener noreferrer"
                            >
                              View file
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </td>
      </Fade>
    </>
  );
}

export default TableRow;
