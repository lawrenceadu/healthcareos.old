import { Fragment, InputHTMLAttributes } from 'react';
import { Accordion, Button, Confirm } from '@healthcareos/react';
import { DeleteIcon } from '@healthcare/icons';
import { startCase } from 'lodash';
import { helpers } from '@healthcare/utils';
import dayjs from 'dayjs';

import { deletePrescribedMedicationService } from '../../../../services/pharmacy';
import { PrescriptionModel } from '../../../../models';
import Update from './Update';
import { toast } from 'react-toastify';

export interface PrescriptionProps
  extends InputHTMLAttributes<HTMLInputElement> {
  prescription: PrescriptionModel;
  mutate?: () => void;
}

export function Prescription({
  mutate,
  className,
  prescription,
  ...props
}: PrescriptionProps) {
  /**
   * variables
   */
  const medicines = prescription.medicines.map((medicine) => ({
    medicine: medicine.medicine,
    items: [
      { label: 'Dosage', value: `${medicine.dose} ${medicine.unit}` },
      { label: 'Route', value: startCase(medicine.route) },
      { label: 'Schedule', value: startCase(medicine.schedule) },
      {
        label: 'Start date',
        value: medicine.start_date
          ? dayjs(medicine.start_date).format('ddd DD, MMM YYYY')
          : '',
      },
      {
        label: 'Stop date',
        value: medicine.stop_date
          ? dayjs(medicine.stop_date).format('ddd DD, MMM YYYY')
          : '',
      },
      {
        label: 'Administration time',
        value: medicine.administration_time.length
          ? medicine.administration_time
              .map((i) => {
                const times = i.split(':');
                return dayjs()
                  .set('hour', Number(times[0]))
                  .set('minutes', Number(times[1]))
                  .format('h:mm a');
              })
              .join(', ')
          : '',
      },
    ],
  }));

  const items = [
    { label: 'Prescribed by', value: prescription.created_by.name },
    {
      label: 'Prescribed at',
      value: dayjs(prescription.created_at).format('ddd DD, MMM YYYY @ h:mm a'),
    },
    { label: 'Notes', value: prescription.notes },
  ];

  /**
   * function
   */
  const handleDelete = () =>
    Confirm({
      header: 'Delete prescription',
      message:
        'Are you sure you want to delete this prescription? Once you delete it you will lose it forever.',
      buttons: {
        proceed: {
          value: 'Delete prescription',
        },
      },
    }).then((proceed) => {
      if (proceed) {
        deletePrescribedMedicationService(prescription.id)
          .then(() => {
            mutate?.();
            toast.success('Prescription deleted');
          })
          .catch(() => toast.error('Unable to delete prescription'));
      }
    });

  return (
    <Accordion.Item
      header={
        <p className="text-lg font-bold">
          {dayjs(prescription.created_at).format('ddd DD, MMM YYYY')}
        </p>
      }
      actions={
        <>
          <Update prescription={prescription}>
            {({ proceed }) => (
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  proceed();
                }}
                className="btn-secondary !h-8 !px-4"
              >
                update
              </Button>
            )}
          </Update>

          <Button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete();
            }}
            className="!px-0 !h-auto"
          >
            <DeleteIcon size={20} />
          </Button>
        </>
      }
      className="p-4 border border-gray-200 rounded-lg"
    >
      <div
        className={helpers.classNames(
          'pb-4 mb-6',
          'flex gap-4 flex-col',
          'border-b border-gray-200'
        )}
      >
        {medicines.map((i, key) => (
          <div key={key}>
            <p className="text-lg font-bold">{i.medicine.name}</p>

            {i.items.map((i, key) => (
              <Fragment key={key}>
                {i.value && (
                  <div className="flex gap-4" key={key}>
                    <div className="flex-[0_0_144px]">
                      <small className="text-muted text-sm font-medium">
                        {i.label}:
                      </small>
                    </div>
                    <small className="text-sm">{i.value}</small>
                  </div>
                )}
              </Fragment>
            ))}
          </div>
        ))}
      </div>
      <div>
        <div>
          <p className="text-lg font-bold">Other information</p>

          <div className={helpers.classNames('flex flex-col')}>
            {items.map((i, key) => (
              <Fragment key={key}>
                {i.value && (
                  <div className="flex gap-4" key={key}>
                    <div className="flex-[0_0_144px]">
                      <small className="text-muted text-sm font-medium">
                        {i.label}:
                      </small>
                    </div>
                    <small className="text-sm">{i.value}</small>
                  </div>
                )}
              </Fragment>
            ))}
          </div>
        </div>
      </div>
    </Accordion.Item>
  );
}

export default Prescription;
