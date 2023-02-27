import { InputHTMLAttributes } from 'react';
import { Accordion, Field } from '@healthcareos/react';

// eslint-disable-next-line
export interface PrescriptionProps
  extends InputHTMLAttributes<HTMLInputElement> {}

export function Prescription({ className, ...props }: PrescriptionProps) {
  /**
   * variables
   */
  const items = [
    { label: 'Taken', value: '2 times per day for 5 days as required' },
    { label: 'Single dosage', value: '2 micrograms' },
    { label: 'Dispense until', value: '4 February 2023' },
    { label: 'Prescribed by', value: 'Doctor Quansah 14:47 26/01/2023' },
  ];

  return (
    <Accordion.Item
      defaultOpen
      header={<p className="text-lg font-bold">Aspirin 400 mg tablet</p>}
      actions={<Field.Checkbox {...props} />}
      className="p-4 border border-gray-200 rounded-lg"
    >
      <div className="flex flex-col">
        {items.map((i, key) => (
          <div className="flex gap-4" key={key}>
            <div className="flex-[0_0_120px]">
              <small className="text-muted text-sm">{i.label}:</small>
            </div>
            <small className="text-sm">{i.value}</small>
          </div>
        ))}
      </div>
    </Accordion.Item>
  );
}

export default Prescription;
