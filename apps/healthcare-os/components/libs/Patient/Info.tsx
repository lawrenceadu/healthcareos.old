import { HtmlHTMLAttributes } from 'react';
import { helpers, useWidth } from '@healthcare/utils';
import { Accordion, Badge } from '@healthcareos/react';
import { CheckIcon } from '@healthcare/icons';
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
   * variable
   */
  const activeInsurance =
    patient?.insurances?.find((i) => i.active) ||
    patient.insurances?.[0] ||
    false;

  /**
   * variables
   */
  const items = [
    {
      label: 'Name',
      value: [patient.first_name, patient.middle_name].join(' ').trim(),
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
      value: (
        <>
          {!activeInsurance && <p>None</p>}
          {activeInsurance && (
            <Badge variant={activeInsurance.active ? 'success' : 'danger'}>
              {activeInsurance.active && (
                <>
                  <CheckIcon className="w-3 h-3" />
                  <span>valid</span>
                </>
              )}

              {!activeInsurance.active && (
                <>
                  <span>not valid</span>
                </>
              )}
            </Badge>
          )}
        </>
      ),
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
          {items.map((item, key) => (
            <div key={key} className="flex items-center justify-between gap-6">
              <p className="text-muted">{item.label}</p>
              <div className="text-right">{item.value}</div>
            </div>
          ))}
        </div>
      </Accordion.Item>
    </Accordion>
  );
}

export default Info;
