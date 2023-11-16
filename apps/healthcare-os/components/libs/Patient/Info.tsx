import { Fragment, HtmlHTMLAttributes } from 'react';
import { helpers, useWidth } from '@healthcare/utils';
import { Accordion, Badge } from '@healthcareos/react';
import { startCase } from 'lodash';
import dayjs from 'dayjs';

import { usePatient } from '../../../hooks';

// eslint-disable-next-line
export interface InfoProps extends HtmlHTMLAttributes<HTMLDivElement> {}

export function Info({ className, ...props }: InfoProps) {
  /**
   * hook
   */
  const { patient } = usePatient();

  /**
   * variables
   */
  const items = [
    {
      label: 'Folder number',
      value: patient.folder_number,
    },
    {
      label: 'Name',
      value: patient.name,
    },
    { label: 'Surname', value: patient.last_name },
    {
      label: 'Date of birth',
      value: dayjs(patient.dob).format('DD/MM/YYYY'),
    },
    { label: 'Sex', value: startCase(patient.gender) },
    {
      label: 'Address',
      value: [patient?.region?.name, patient?.district?.name].join(', '),
    },
    { label: 'Language', value: startCase(patient.language) },
    { label: 'Marital status', value: startCase(patient.marital_status) },
    {
      label: 'Insurance',
      value: patient.insurances?.length ? (
        <div className="flex flex-wrap items-center justify-end gap-1 divide-x divide-neutral-200">
          {patient.insurances.map((i, key) => (
            <div key={key} className="flex items-center gap-1 px-2">
              <p>{i.scheme_name}</p>
              <Badge
                variant={
                  helpers.hasExpired(i.expiry_date) ? 'danger' : 'success'
                }
              >
                {helpers.hasExpired(i.expiry_date) ? 'expired' : 'valid'}
              </Badge>
            </div>
          ))}
        </div>
      ) : (
        ''
      ),
    },
    {
      label: 'Institution',
      value: patient?.institution?.name,
    },
  ];

  const width = useWidth();

  return (
    <Accordion
      className={helpers.classNames(
        'xl:pb-6',
        'border-b border-gray-200',
        className
      )}
    >
      <Accordion.Item
        defaultOpen={width && width >= 1280}
        header={<p className="text-lg font-bold">Patient information</p>}
      >
        <div className="flex flex-col gap-1">
          {items
            .filter((i) => !!i.value)
            .map((item, key) => (
              <Fragment key={key}>
                <div className="flex items-center justify-between gap-6">
                  <p className="text-muted">{item.label}</p>
                  <div className="text-right">{item.value}</div>
                </div>
              </Fragment>
            ))}
        </div>
      </Accordion.Item>
    </Accordion>
  );
}

export default Info;
