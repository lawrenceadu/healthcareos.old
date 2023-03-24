import { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@healthcare/icons'; // prettier-ignore
import { helpers } from '@healthcare/utils';

import { MedicineInventoryModel } from '../../../../../models';

export interface TableRowProps {
  medicine: MedicineInventoryModel;
}

function TableRow({ medicine }: TableRowProps) {
  /**
   * state
   */
  const [toggle, setToggle] = useState(false);

  return (
    <>
      <tr
        className={helpers.classNames('cursor-pointer', toggle && 'bg-gray-50')}
        onClick={() => setToggle(!toggle)}
      >
        <td className="flex gap-2 items-center">
          <span>{toggle ? <ChevronUpIcon /> : <ChevronDownIcon />}</span>
          <span>{medicine.name}</span>
        </td>
        <td className="text-right">{medicine.quantity}</td>
      </tr>

      {toggle && (
        <tr>
          <td colSpan={2} className="!p-0">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th className="text-right">Quantity</th>
                </tr>
              </thead>
              <tbody>
                {medicine.locations.map((location, key) => (
                  <tr key={key}>
                    <td>{location.name}</td>
                    <td className="text-right">{location.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </td>
        </tr>
      )}
    </>
  );
}

export default TableRow;
