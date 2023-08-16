import { Fragment } from 'react';
import { Accordion, Badge, Button, Confirm } from '@healthcareos/react';
import { DeleteIcon } from '@healthcare/icons';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';

import { HistoryLog, ProcedureRequestHistoryModel } from '../../../../models/history'; // prettier-ignore
import { deleteProcedureRequestService } from '../../../../services/patient';
import { usePatient, usePermissions } from '../../../../hooks';
import ProcedureRequestForm from '../Procedure';

export interface ProcedureProps {
  data: Omit<HistoryLog, 'details'> & { details: ProcedureRequestHistoryModel };
  isOngoing: boolean;
}

export function Procedure({ data, isOngoing }: ProcedureProps) {
  /**
   * perm
   */
  const [canEdit, canDelete] = usePermissions(
    'procedurerequest_edit',
    'procedurerequest_delete'
  );

  /**
   * variables
   */
  const procedure = data.details;

  const requestItems = [
    { label: 'Procedure', value: procedure.procedure?.name },
    { label: 'Diagnosis', value: procedure.diagnosis?.name },
    {
      label: 'Execution date',
      value: procedure.execution_date
        ? dayjs(procedure.execution_date).format('DD/MM/YYYY @ h:mm a')
        : '',
    },
    { label: 'Notes', value: procedure.notes },
    { label: 'Requested by', value: procedure.created_by.name },
    {
      label: 'Requested at',
      value: dayjs(procedure.created_at).format('DD/MM/YYYY @ h:mm a'),
    },
  ];

  const submitItems =
    procedure.status === 'completed'
      ? [
          { label: 'Report', value: procedure.report },
          {
            label: 'Participants',
            value: procedure?.users?.map((i) => i.name)?.join(', ') || '',
          },
          { label: 'Submitted by', value: procedure.submitted_by.name },
          {
            label: 'Submitted at',
            value: dayjs(procedure.submitted_at).format('DD/MM/YYYY @ h:mm a'),
          },
        ]
      : [];

  /**
   * hook
   */
  const { updateHistory } = usePatient();

  /**
   * functions
   */
  const handleDelete = () =>
    Confirm({
      header: 'Delete procedure',
      message:
        'Are you sure you want to delete these procedure? This action is not reversible',
      buttons: {
        proceed: {
          value: 'Delete',
          className: 'btn-error',
        },
      },
    }).then((proceed) => {
      if (proceed) {
        deleteProcedureRequestService(data.details.id)
          .then(() => {
            updateHistory();
          })
          .catch(() => toast.error('Unable to delete procedure'));
      }
    });

  return (
    <Accordion.Item
      className="py-2"
      header={
        <>
          <Badge className="bg-lime-50 text-lime-600">Procedure</Badge>
          <p className="text-sm font-bold mt-1">
            {data.details.procedure?.name}
          </p>
        </>
      }
      actions={
        <>
          {isOngoing && (
            <>
              {canEdit && (
                <ProcedureRequestForm
                  params={{
                    id: procedure.id,
                    report: procedure.report || '',
                    notes: procedure.notes || '',
                    procedure: {
                      label: procedure.procedure.name,
                      value: procedure.procedure.id,
                    },
                    diagnosis: {
                      label: procedure.diagnosis.name,
                      value: procedure.diagnosis.id,
                    },
                    execution_date: procedure.execution_date,
                    users:
                      procedure?.users?.map((i) => ({
                        label: i.name,
                        value: i.id,
                      })) || [],
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
                </ProcedureRequestForm>
              )}

              {canDelete && procedure.status === 'scheduled' && (
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
      <div className="flex flex-col">
        {requestItems.map((i, key) => (
          <Fragment key={key}>
            {i.value && (
              <div className="flex gap-4" key={key}>
                <div className="flex-[0_0_120px]">
                  <small className="text-muted text-sm font-medium">
                    {i.label}:
                  </small>
                </div>
                <div className="text-sm">{i.value}</div>
              </div>
            )}
          </Fragment>
        ))}
      </div>

      {procedure.status === 'completed' && (
        <div className="mt-6">
          <p className="text-sm font-medium">Results</p>
          <div className="flex flex-col">
            {submitItems.map((i, key) => (
              <Fragment key={key}>
                {i.value && (
                  <div className="flex gap-4">
                    <div className="flex-[0_0_120px]">
                      <small className="text-muted text-sm font-medium">
                        {i.label}:
                      </small>
                    </div>
                    <div className="text-sm">{i.value}</div>
                  </div>
                )}
              </Fragment>
            ))}
          </div>
        </div>
      )}
    </Accordion.Item>
  );
}

export default Procedure;
