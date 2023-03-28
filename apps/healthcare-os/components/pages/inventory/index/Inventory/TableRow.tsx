import { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@healthcare/icons'; // prettier-ignore
import { helpers } from '@healthcare/utils';
import { motion } from 'framer-motion';
import { Fade } from '@healthcareos/react';

import { ItemInventoryModel } from '../../../../../models';

export interface TableRowProps {
  item: ItemInventoryModel;
}

function TableRow({ item }: TableRowProps) {
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
          <span>{item.name}</span>
        </td>
        <td className="text-right">{item.quantity}</td>
      </tr>

      <Fade show={toggle} as={motion.tr}>
        <td colSpan={2} className="!p-0">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th className="text-right">Quantity</th>
              </tr>
            </thead>
            <tbody>
              {item.locations.map((location, key) => (
                <tr key={key}>
                  <td>{location.name}</td>
                  <td className="text-right">{location.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </td>
      </Fade>
    </>
  );
}

export default TableRow;
