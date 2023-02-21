import { Accordion } from '@healthcareos/react';
import React from 'react';

export function Investigation() {
  /**
   * variables
   */
  const items = [
    { label: 'Outcome', value: 'Swollen lips and face.' },
    { label: 'Notes', value: 'Stay away from any food with nuts in it.' },
    { label: 'Date added', value: '12/01/2023' },
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

export default Investigation;
