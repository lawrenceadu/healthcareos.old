import { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon, DotsHorizIcon } from '@healthcare/icons'; // prettier-ignore
import { Badge, Dropdown, Fade } from '@healthcareos/react';
import { useRouter } from 'next/router';
import { helpers } from '@healthcare/utils';
import { motion } from 'framer-motion';
import useSWR from 'swr';
import dayjs from 'dayjs';

import { DispenseModel, PatientModel, PrescriptionModel, PrescriptionPrintModel } from '../../../../../models'; // prettier-ignore
import { usePermissions } from '../../../../../hooks';
import Prescriptions from './TableRow/Prescriptions';
import Dispenses from './TableRow/Dispenses';
import Dispense from './Dispense';
import routes from '../../../../../routes';
import Prints from './TableRow/Prints';
import Print from './Print';

export interface TableRowProps {
  patient?: PatientModel;
  mutate: () => void;
  prescription: PrescriptionModel;
}

function TableRow({ mutate, patient, prescription }: TableRowProps) {
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

  const { data: dispenseData } = useSWR<{ dispenses: DispenseModel[] }>(
    toggle &&
      prescription.status === 'dispensed' &&
      `/prescription/${prescription.id}/dispense`
  );

  /**
   * variables
   */
  const prints = printsData?.prints || [];
  const dispenses = dispenseData?.dispenses?.[0];

  return (
    <>
      <tr
        role="button"
        onClick={() => setToggle(!toggle)}
        className={helpers.classNames(toggle && 'bg-gray-50')}
      >
        {!patient && (
          <td>
            <div className="flex gap-2 items-center">
              {toggle ? (
                <ChevronUpIcon size={20} />
              ) : (
                <ChevronDownIcon size={20} />
              )}
              <span>{prescription.patient.name}</span>
            </div>
          </td>
        )}
        <td>
          <div className="flex gap-2 items-center">
            {patient &&
              (toggle ? (
                <ChevronUpIcon size={20} />
              ) : (
                <ChevronDownIcon size={20} />
              ))}

            <div className="max-w-[248px] truncate">
              {prescription.medicines.map((i) => i.medicine.name).join(', ')}
            </div>
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
        {!patient && (
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
        )}
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
            {/* Prescriptions */}
            <Prescriptions {...{ prescription }} />

            {!!dispenses?.details?.length && (
              <Dispenses dispenses={dispenses} />
            )}

            {!!prints.length && <Prints prints={prints} />}
          </div>
        </td>
      </Fade>
    </>
  );
}

export default TableRow;
