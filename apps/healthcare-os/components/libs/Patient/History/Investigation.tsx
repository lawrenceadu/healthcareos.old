import { Fragment } from 'react';
import { Accordion, Badge } from '@healthcareos/react';
import dayjs from 'dayjs';

import { HistoryLog, InvestigationHistoryModel } from '../../../../models/history'; // prettier-ignore

export interface InvestigationProps {
  data: Omit<HistoryLog, 'details'> & { details: InvestigationHistoryModel };
}

export function Investigation({ data }: InvestigationProps) {
  /**
   * variables
   */
  const investigation = data.details;

  const requestItems = [
    {
      label: 'Expected date',
      value: investigation.expected_date
        ? dayjs(investigation.expected_date).format('DD/MM/YYYY @ h:mm a')
        : '',
    },
    { label: 'Notes', value: investigation.notes },
    { label: 'Requested by', value: investigation.created_by.name },
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

  return (
    <Accordion.Item
      className="py-2"
      header={
        <>
          <Badge className="bg-red-50 text-red-600">Investigation</Badge>
          <p className="text-sm font-bold mt-1">
            {data.details.investigation.name}
          </p>
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

      {investigation.status === 'submitted' && (
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

            {investigation.attachment && (
              <div className="flex gap-4">
                <div className="flex-[0_0_120px]">
                  <small className="text-muted text-sm font-medium">
                    Attachment:
                  </small>
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
