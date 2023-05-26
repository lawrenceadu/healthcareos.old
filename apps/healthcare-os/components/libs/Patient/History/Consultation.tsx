import { Accordion, Badge, Button, Confirm } from '@healthcareos/react';
import { DeleteIcon } from '@healthcare/icons';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';

import { ConsultationHistoryModel, HistoryLog } from '../../../../models/history'; // prettier-ignore
import { usePatient, usePermissions } from '../../../../hooks';
import { deleteConsultationService } from '../../../../services/patient';
import ConsultationForm from '../Consultation';

export interface ConsultationProps {
  data: Omit<HistoryLog, 'details'> & { details: ConsultationHistoryModel };
  isOngoing: boolean;
}

export function Consultation({ data, isOngoing }: ConsultationProps) {
  /**
   * perm
   */
  const [canEdit, canDelete] = usePermissions(
    'consultation_edit',
    'consultation_delete'
  );

  /**
   * variables
   */
  const items = [
    { label: 'Problem', value: data.details.history_examination },
    {
      label: 'Diagnosis',
      value: (
        <div className="flex gap-1">
          {data.details.diagnoses.map((i, key) => (
            <Badge key={key} variant="light">
              {i.name}
            </Badge>
          ))}
        </div>
      ),
    },
    { label: 'Plan', value: data.details.plan },
    { label: 'Added by', value: data.created_by.name },
    {
      label: 'Added at',
      value: dayjs(data.created_at).format('ddd DD, MMM YYYY @ hh:mma'),
    },
  ];

  const description = Array.from(
    { length: 2 },
    (_, i) => data.details.diagnoses?.[i]?.name
  )
    .filter((i) => i)
    .join(', ');

  /**
   * hook
   */
  const { updateHistory } = usePatient();

  /**
   * functions
   */
  const handleDelete = () =>
    Confirm({
      header: 'Delete consultation',
      message:
        'Are you sure you want to delete these consultation? This action is not reversible',
      buttons: {
        proceed: {
          value: 'Delete',
          className: 'btn-error',
        },
      },
    }).then((proceed) => {
      if (proceed) {
        deleteConsultationService(data.details.id)
          .then(() => {
            updateHistory();
          })
          .catch(() => toast.error('Unable to delete consultation'));
      }
    });

  return (
    <Accordion.Item
      className="py-2"
      header={
        <>
          <Badge className="bg-green-50 text-green-600">Consultation</Badge>
          <p className="text-sm font-bold mt-1">{description}</p>
        </>
      }
      actions={
        <>
          {isOngoing && (
            <>
              {canEdit && (
                <ConsultationForm
                  params={{
                    id: data.details.id,
                    plan: data.details.plan,
                    history_examination: data.details.history_examination,
                    diagnosis: data.details.diagnoses.map((i) => ({
                      label: i.name,
                      value: i.id,
                    })),
                  }}
                >
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
                </ConsultationForm>
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
      <div className="flex gap-2 flex-col">
        {items.map((i, key) => (
          <div className="flex justify-between gap-4" key={key}>
            <small className="text-muted text-sm font-medium">{i.label}</small>
            {typeof i.value === 'string' ? (
              <small className="text-sm font-medium">{i.value}</small>
            ) : (
              i.value
            )}
          </div>
        ))}
      </div>
    </Accordion.Item>
  );
}

export default Consultation;
