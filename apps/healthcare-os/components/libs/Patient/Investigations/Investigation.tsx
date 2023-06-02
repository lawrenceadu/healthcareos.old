import { Fragment, HtmlHTMLAttributes } from 'react';
import { Accordion, Badge, Button, Confirm } from '@healthcareos/react';
import { DeleteIcon } from '@healthcare/icons';
import { helpers } from '@healthcare/utils';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';

import { deleteInvestigationRequestService } from '../../../../services/investigation';
import { InvestigationRequestModel } from '../../../../models';
import { usePermissions } from '../../../../hooks';

export interface InvestigationProps extends HtmlHTMLAttributes<HTMLDivElement> {
  investigation: InvestigationRequestModel;
  mutate: () => void;
}

export function Investigation({
  mutate,
  className,
  investigation,
  ...props
}: InvestigationProps) {
  /**
   * perm
   */
  const [canDelete] = usePermissions('investigationrequest_delete');

  /**
   * variables
   */
  const requestItems = [
    { label: 'Notes', value: investigation.notes },

    {
      label: 'Expected date',
      value: investigation.expected_date
        ? dayjs(investigation.expected_date).format('DD/MM/YYYY @ h:mm a')
        : '',
    },
    {
      label: 'Requested by',
      value: investigation.created_by.name,
    },
    {
      label: 'Requested at',
      value: dayjs(investigation.created_at).format('DD/MM/YYYY @ h:mm a'),
    },
  ];

  const submitItems =
    investigation.status === 'submitted'
      ? [
          ...investigation.results.map((item, key) => ({
            label: item.label,
            value: (() => {
              try {
                const i = JSON.parse(item.value);

                if (i[0]?.value) {
                  return (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr>
                            {i.map((j, key) => (
                              <th key={key}>{j.label}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            {i.map((j, key) => (
                              <td key={key}>{j.value}</td>
                            ))}
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  );
                } else {
                  return i.join(', ');
                }
              } catch (error) {
                return item.value;
              }
            })(),
          })),
          { label: 'Report', value: investigation.report },
          { label: 'Submitted by', value: investigation.submitted_by.name },
          {
            label: 'Submitted at',
            value: dayjs(investigation.submitted_at).format(
              'DD/MM/YYYY @ h:mm a'
            ),
          },
        ]
      : [];

  /**
   * functions
   */
  const handleDelete = () =>
    Confirm({
      header: 'Delete investigation',
      message: (
        <>
          You are about to delete the <b>{investigation.investigation.name}</b>{' '}
          request? Once you delete it you will lose it forever.
        </>
      ),
      buttons: {
        proceed: {
          className: 'btn-error',
          value: 'Delete investigation',
        },
      },
    }).then((proceed) => {
      if (proceed) {
        deleteInvestigationRequestService(investigation.id)
          .then(() => {
            mutate?.();
          })
          .catch(() => toast.error('Unable to delete request'));
      }
    });

  return (
    <Accordion.Item
      defaultOpen
      header={
        <p className="text-lg font-bold">{investigation.investigation.name}</p>
      }
      actions={
        <>
          {investigation.status === 'pending' && (
            <>
              <Badge variant="pending">Pending</Badge>
              {canDelete && (
                <Button
                  className="!h-auto !px-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete();
                  }}
                >
                  <DeleteIcon />
                </Button>
              )}
            </>
          )}
        </>
      }
      className={helpers.classNames(
        className,
        'p-4 border border-gray-200 rounded-lg'
      )}
    >
      <div>
        <p className="font-medium">Request info</p>
        <div className="flex flex-col">
          {requestItems.map((i, key) => (
            <Fragment key={key}>
              {i.value && (
                <div className="flex gap-4">
                  <div className="flex-[0_0_120px]">
                    <small className="text-muted text-sm">{i.label}:</small>
                  </div>
                  <div className="text-sm w-full">{i.value}</div>
                </div>
              )}
            </Fragment>
          ))}
        </div>
      </div>

      {investigation.status === 'submitted' && (
        <div className="mt-6">
          <p className="font-medium">Results</p>
          <div className="flex flex-col gap-2">
            {submitItems.map((i, key) => (
              <Fragment key={key}>
                {i.value && (
                  <div className="flex gap-4">
                    <div className="flex-[0_0_120px]">
                      <small className="text-muted text-sm">{i.label}:</small>
                    </div>
                    <div className="text-sm w-full">{i.value}</div>
                  </div>
                )}
              </Fragment>
            ))}

            {investigation.attachment && (
              <div className="flex gap-4">
                <div className="flex-[0_0_120px]">
                  <small className="text-muted text-sm">Attachment:</small>
                </div>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={investigation.attachment}
                  className="text-sm underline text-blue-700"
                >
                  View attachment
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </Accordion.Item>
  );
}

export default Investigation;
