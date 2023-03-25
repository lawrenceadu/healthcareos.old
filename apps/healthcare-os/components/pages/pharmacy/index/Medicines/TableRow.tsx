import { Confirm, Dropdown } from '@healthcareos/react';
import { ChevronDownIcon, ChevronUpIcon, DotsHorizIcon } from '@healthcare/icons'; // prettier-ignore
import { useState } from 'react';
import { helpers } from '@healthcare/utils';
import { toast } from 'react-toastify';

import { deleteMedicineService } from '../../../../../services/pharmacy';
import { MedicineModel } from '../../../../../models';
import { useStore } from '../../../../../hooks';
import Form from './Form';

export interface TableRowProps {
  medicine: MedicineModel;
  mutate: () => void;
}

function TableRow({ medicine, mutate }: TableRowProps) {
  /**
   * state
   */
  const [toggle, setToggle] = useState(false);

  /**
   * store
   */
  const { store } = useStore();

  /**
   * variables
   */
  const currency = store?.facility?.currency_symbol;

  /**
   * function
   */
  const handleDelete = () =>
    Confirm({
      header: 'Delete Item',
      message: (
        <>
          You are about to delete <b>{medicine.name}</b>. Once you delete it you
          will lose it forever.
        </>
      ),
      buttons: {
        proceed: {
          value: 'Delete',
          className: 'btn-error',
        },
      },
    }).then((proceed) => {
      if (proceed) {
        deleteMedicineService(medicine.id)
          .then(() => {
            toast.success('Medicine deleted');
            mutate?.();
          })
          .catch(() => {
            toast.error('Unable to delete medicine');
          });
      }
    });

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
        <td>{medicine.code}</td>
        <td>{medicine.category.name}</td>
        <td>{medicine.group}</td>
        <td>{medicine.unit}</td>
        <td className="text-right">{medicine.minimum_level}</td>
        <td className="text-right">{medicine.reorder_level}</td>
        <td>
          <Dropdown>
            <Dropdown.Toggle className="mx-auto">
              <DotsHorizIcon />
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Form params={medicine} mutate={mutate}>
                {({ proceed }) => (
                  <Dropdown.Item onClick={() => proceed()}>
                    Update
                  </Dropdown.Item>
                )}
              </Form>
              <Dropdown.Item
                className="text-red-600"
                onClick={() => handleDelete()}
              >
                Delete
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </td>
      </tr>

      {toggle && (
        <tr>
          <td colSpan={8} className="!p-0">
            <table>
              <thead>
                <tr>
                  <th>Cost Price</th>
                  <th>Regular Price</th>
                  <th>NHIS Price</th>
                  <th>Private insurance Price</th>
                  <th className="text-right">Available Quantity</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{`${currency} ${medicine.cost_price}`}</td>
                  <td>{`${currency} ${medicine.regular_price}`}</td>
                  <td>{`${currency} ${medicine.nhis_price}`}</td>
                  <td>{`${currency} ${medicine.private_price}`}</td>
                  <td className="text-right">{medicine.quantity}</td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      )}
    </>
  );
}

export default TableRow;
