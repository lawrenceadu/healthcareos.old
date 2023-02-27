import { Accordion, Badge } from '@healthcareos/react';
import React from 'react';

export function Consultation() {
  /**
   * variables
   */
  const items = [
    { label: 'Problem', value: 'Headache and stomach pains' },
    {
      label: 'Diagnosis',
      value: (
        <div className="flex gap-1">
          <Badge variant="light">Malaria (confirm)</Badge>
          <Badge variant="light">Fever</Badge>
        </div>
      ),
    },
    { label: 'Plan', value: 'Run some tests to confirm this shit' },
  ];

  return (
    <Accordion.Item
      className="px-2"
      header={
        <>
          <p className="text-xs !text-yellow-500">Consultation</p>
          <p className="text-sm font-bold">Malaria (confirm), Fever</p>
        </>
      }
    >
      <div className="flex gap-2 flex-col pb-2 border-b border-gray-200">
        {items.map((i, key) => (
          <div className="flex justify-between gap-4" key={key}>
            <small className="text-muted text-sm">{i.label}</small>
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
