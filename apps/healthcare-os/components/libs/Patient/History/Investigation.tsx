import { Accordion } from '@healthcareos/react';
import React from 'react';

export function Investigation() {
  /**
   * variables
   */
  const items = [
    { label: 'Result', value: 'Negative' },
    { label: 'Requested by', value: 'Doctor Francis Affram' },
    { label: 'Submitted by', value: 'Technician Albert Johnson' },
    { label: 'Notes', value: 'This is a test note for investigation' },
  ];

  return (
    <Accordion.Item
      className="px-2"
      header={
        <>
          <p className="text-xs !text-green-700">Investigation</p>
          <p className="text-sm font-bold">
            MCH - Antenatal clinic visit (Add ANC clinic visit investigation)
          </p>
        </>
      }
    >
      <div className="flex flex-col pb-2 border-b border-gray-200">
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

export default Investigation;
