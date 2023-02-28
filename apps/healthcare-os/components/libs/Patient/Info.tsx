import { HtmlHTMLAttributes, useContext } from 'react';
import { helpers, useWidth } from '@healthcare/utils';
import { Accordion, Badge } from '@healthcareos/react';
import { CheckIcon } from '@healthcare/icons';
import dayjs from 'dayjs';

import { PatientContext } from '../../../contexts/Patient';

// eslint-disable-next-line
export interface InfoProps extends HtmlHTMLAttributes<HTMLDivElement> {}

export function Info({ className, ...props }: InfoProps) {
  /**
   * context
   */
  const { patient } = useContext(PatientContext);

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
      value: dayjs(patient.date_of_birth).format('DD/MM/YYYY'),
    },
    { label: 'Sex', value: patient.sex },
    {
      label: 'Address',
      value: [
        patient.address.street,
        patient.address.city,
        patient.address.region,
      ].join(', '),
    },
    { label: 'Language', value: patient.language },
    { label: 'Marital status', value: patient.marital_status },
    {
      label: 'Insurance',
      value: (
        <>
          {!patient.insurance && <p>None</p>}
          {patient.insurance && (
            <Badge variant={patient.insurance.is_valid ? 'success' : 'danger'}>
              {patient.insurance.is_valid && (
                <>
                  <CheckIcon className="w-3 h-3" />
                  <span>valid</span>
                </>
              )}

              {!patient.insurance.is_valid && (
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
