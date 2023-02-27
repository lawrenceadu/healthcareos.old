import { Accordion } from '@healthcareos/react';
import React from 'react';

export function Vitals() {
  /**
   * variables
   */
  const items = [
    { label: 'Respiratory rate', value: '200 bpm' },
    { label: 'Oxygen saturations', value: '10%' },
    { label: 'Fraction of inspired oxygen', value: '19%' },
    { label: 'Heart rate', value: '289 bpm' },
    { label: 'Blood pressure - Systolic', value: '12 mmHg' },
    { label: 'Blood pressure - Diastolic', value: '123 mmHg' },
    { label: 'Temperature', value: '34 °C' },
    { label: 'Height', value: '179 cm' },
    { label: 'Weight', value: '78 kg' },
    { label: 'BMI', value: '24.4 kg/m^2' },
    { label: 'Body surface area', value: '24 m^2' },
    { label: 'Notes', value: 'This is a test note for vitals check' },
  ];

  return (
    <Accordion.Item
      className="px-2"
      header={
        <>
          <p className="text-xs !text-green-700">Investigation</p>
          <p className="text-sm font-bold">Vitals</p>
        </>
      }
    >
      <div className="flex gap-2 flex-col pb-2 border-b border-gray-200">
        {items.map((i, key) => (
          <div className="flex gap-4 justify-between" key={key}>
            <small className="text-sm">{i.label}:</small>
            <small className="text-muted font-medium text-sm">{i.value}</small>
          </div>
        ))}
      </div>
    </Accordion.Item>
  );
}

export default Vitals;
