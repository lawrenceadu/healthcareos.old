import { HtmlHTMLAttributes } from 'react';
import { Accordion, Badge } from '@healthcareos/react';
import { CheckIcon } from '@healthcare/icons';
import { helpers } from '@healthcare/utils';

// eslint-disable-next-line
export interface InfoProps extends HtmlHTMLAttributes<HTMLDivElement> {}

export function Info({ className, ...props }: InfoProps) {
  /**
   * variables
   */
  const items = [
    { label: 'Name', value: 'Jennifer' },
    { label: 'Surname', value: 'Koomson' },
    { label: 'Date of birth', value: '14/01/1992' },
    { label: 'Sex', value: 'Female' },
    { label: 'Address', value: 'Greater Accra, Accra Metropolitan District' },
    { label: 'Language', value: 'English, Spanish' },
    { label: 'Marital status', value: 'Married' },
    {
      label: 'Insurance',
      value: (
        <Badge variant="success">
          <CheckIcon className="w-3 h-3" />
          <span>valid</span>
        </Badge>
      ),
    },
  ];

  return (
    <Accordion
      className={helpers.classNames(
        'pb-6',
        'border-b border-gray-200',
        className
      )}
    >
      <Accordion.Item
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
