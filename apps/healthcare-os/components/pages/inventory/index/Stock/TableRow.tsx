import { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon, DotsHorizIcon } from '@healthcare/icons'; // prettier-ignore
import { Badge, Confirm, Dropdown } from '@healthcareos/react';
import { helpers } from '@healthcare/utils';
import dayjs from 'dayjs';

import { deleteItemStockService } from '../../../../../services/inventory';
import { ItemStockModel } from '../../../../../models';
import { useStore } from '../../../../../hooks';
import Form from './Form';
import { toast } from 'react-toastify';

// import ChangeForm from './Change';
// import MoveForm from './Move';

export interface TableRowProps {
  stock: ItemStockModel;
  mutate: () => void;
}

function TableRow({ stock, mutate }: TableRowProps) {
  /**
   * state
   */
  const [toggle, setToggle] = useState(false);

  /**
   * store
   */
  const { store } = useStore();

  /**
   * function
   */
  const handleDelete = () =>
    Confirm({
      header: 'Delete stock',
      message: (
        <>
          You are about to delete this stock? Once you delete it you will lose
          it forever.
        </>
      ),
      buttons: {
        proceed: {
          value: 'Delete stock',
        },
      },
    }).then((proceed) => {
      if (proceed) {
        deleteItemStockService(stock.id)
          .then(() => {
            mutate?.();
            toast.success('Stock deleted');
          })
          .catch(() => toast.error('Unabe'));
      }
    });

  return (
    <>
      <tr
        className={helpers.classNames('cursor-pointer', toggle && 'bg-gray-50')}
        onClick={() => setToggle(!toggle)}
      >
        <td className="flex gap-2 items-center">
          {toggle ? <ChevronUpIcon size={20} /> : <ChevronDownIcon size={20} />}
          <span>{stock.supplier.name}</span>
        </td>
        <td>{stock.location.name}</td>
        <td className="text-right">{stock.details.length}</td>
        <td>{dayjs(stock.date).format('ddd DD, MMM YYYY')}</td>
        <td>{`${store.facility.currency_symbol} ${stock.subtotal}`}</td>
        <td>{`${store.facility.currency_symbol} ${stock.discount}`}</td>
        <td>{`${store.facility.currency_symbol} ${stock.total}`}</td>
        <td>
          <Badge variant={stock.status}>{stock.status}</Badge>
        </td>
        <td onClick={(e) => e.stopPropagation()}>
          <Dropdown>
            <Dropdown.Toggle className="mx-auto">
              <DotsHorizIcon />
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {stock.status === 'pending' && (
                <>
                  <Form params={stock} {...{ mutate }}>
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
                </>
              )}
            </Dropdown.Menu>
          </Dropdown>
        </td>
      </tr>

      {toggle && (
        <>
          <tr>
            <td colSpan={9} className="!p-0">
              <table>
                <thead>
                  <tr>
                    <th>Item</th>
                    <th className="text-right">Quantity</th>
                    <th>Subtotal</th>
                    <th>Discount</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {stock.details.map((detail, key) => (
                    <tr key={key}>
                      <td>{detail.item.name}</td>
                      <td className="text-right">{detail.quantity}</td>
                      <td>{`${store.facility.currency_symbol} ${detail.subtotal}`}</td>
                      <td>{`${store.facility.currency_symbol} ${detail.discount}`}</td>
                      <td>{`${store.facility.currency_symbol} ${detail.total}`}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </td>
          </tr>
          {stock.notes && (
            <tr>
              <td colSpan={8} className="!whitespace-normal">
                <p className="font-medium">Notes:</p>
                <p>{stock.notes}</p>
              </td>
            </tr>
          )}
        </>
      )}
    </>
  );
}

export default TableRow;
