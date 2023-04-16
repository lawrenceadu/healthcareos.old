import { Fragment } from 'react';
import { Accordion, Button, Confirm } from '@healthcareos/react';
import { DeleteIcon } from '@healthcare/icons';
import { startCase } from 'lodash';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';

import { HistoryLog, VitalHistoryModel } from '../../../../models/history';
import { usePatient, usePermissions } from '../../../../hooks';
import { deleteVitalsService } from '../../../../services/patient';
import VitalsForm from '../Vitals';

export interface VitalsProps {
  isOngoing: boolean;
  data: Omit<HistoryLog, 'details'> & { details: VitalHistoryModel };
}

export function Vitals({ data, isOngoing }: VitalsProps) {
  /**
   * perm
   */
  const [canEdit, canDelete] = usePermissions('vital_edit', 'vital_delete');

  /**
   * variables
   */
  const items = [
    {
      label: 'Respiratory rate',
      value: data.details.respiratory_rate,
      unit: 'bpm',
    },
    {
      label: 'Oxygen saturations',
      value: data.details.oxygen_saturations,
      unit: '%',
    },
    {
      label: 'Fraction of inspired oxygen',
      value: data.details.fraction_of_inspired_oxygen,
      unit: '%',
    },
    { label: 'Heart rate', value: data.details.heart_rate, unit: 'bpm' },
    {
      label: 'Blood pressure - Systolic',
      value: data.details.systolic,
      unit: 'mmHg',
    },
    {
      label: 'Blood pressure - Diastolic',
      value: data.details.diastolic,
      unit: 'mmHg',
    },
    { label: 'Temperature', value: data.details.temperature, unit: '°C' },
    { label: 'Height', value: data.details.height, unit: 'cm' },
    { label: 'Weight', value: data.details.weight, unit: 'kg' },
    { label: 'BMI', value: data.details.bmi, unit: 'kg/m^2' },
    {
      label: 'Body surface area',
      value: data.details.body_surface_area,
      unit: 'm^2',
    },
    { label: 'Notes', value: data.details.notes },
    { label: 'Created by', value: data.created_by.name || '--' },
    {
      label: 'Created at',
      value: dayjs(data.created_at).format('ddd DD, MMM YYYY @ hh:mma'),
    },
  ];

  /**
   * hook
   */
  const { updateHistory } = usePatient();

  /**
   * function
   */
  const handleDelete = () =>
    Confirm({
      header: 'Delete Vitals',
      message:
        'Are you sure you want to delete these vitals record? This action is not reversible',
      buttons: {
        proceed: {
          value: 'Delete',
          className: 'btn-error',
        },
      },
    }).then((proceed) => {
      if (proceed) {
        deleteVitalsService(data.details.id)
          .then(() => {
            updateHistory();
          })
          .catch(() => toast.error('Unable to delete vitals'));
      }
    });

  return (
    <Accordion.Item
      className="px-2"
      header={
        <>
          <p className="text-xs !text-red-600">{startCase(data.reference)}</p>
          <p className="text-sm font-bold">{startCase(data.description)}</p>
        </>
      }
      actions={
        <>
          {isOngoing && (
            <>
              {canEdit && (
                <VitalsForm params={data.details}>
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
                </VitalsForm>
              )}

              {canDelete && (
                <Button
                  className="!h-8 !px-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete();
                  }}
                >
                  <DeleteIcon size={20} />
                </Button>
              )}
            </>
          )}
        </>
      }
    >
      <div className="flex gap-2 flex-col pb-2 border-b border-gray-200">
        {items.map((i, key) => (
          <Fragment key={key}>
            {i.value && (
              <div className="flex gap-4 justify-between" key={key}>
                <small className="text-sm">{i.label}:</small>
                <small className="text-muted font-medium text-sm">
                  {i.value}
                  {i?.unit}
                </small>
              </div>
            )}
          </Fragment>
        ))}
      </div>
    </Accordion.Item>
  );
}

export default Vitals;
