import { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon, DotsHorizIcon } from '@healthcare/icons'; // prettier-ignore
import { Badge, Confirm, Dropdown, Fade } from '@healthcareos/react';
import { helpers } from '@healthcare/utils';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';

import { ItemTransferModel } from '../../../../../models';
import { useStore } from '../../../../../hooks';
import * as api from '../../../../../services/inventory';
import Form from './Form';

export interface TableRowProps {
  transfer: ItemTransferModel;
  mutate: () => void;
}

function TableRow({ transfer, mutate }: TableRowProps) {
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
      header: 'Delete transfer',
      message: (
        <>
          You are about to delete this transfer? Once you delete it you will
          lose it forever.
        </>
      ),
      buttons: {
        proceed: {
          value: 'Delete transfer',
        },
      },
    }).then((proceed) => {
      if (proceed) {
        api
          .deleteItemTransferService(transfer.id)
          .then(() => {
            mutate();
            toast.success('Transfer deleted');
          })
          .catch(() => toast.error('Unable to delete transfer'));
      }
    });

  const handleStatusUpdate = (status: ItemTransferModel['status']) =>
    Confirm({
      header: 'Update status',
      message: (
        <>
          Are you sure you want to mark this transfer as <b>{status}</b>?
        </>
      ),
      buttons: {
        proceed: { className: 'btn-primary' },
      },
    }).then((proceed) => {
      if (proceed) {
        api
          .updateItemTransferStatusService({ status }, transfer.id)
          .then(() => {
            toast.success('Transfer status updated');
            mutate();
          })
          .catch(() => toast.error('Unable to update transfer status'));
      }
    });

  return (
    <>
      <tr
        className={helpers.classNames('cursor-pointer', toggle && 'bg-gray-50')}
        onClick={() => setToggle(!toggle)}
      >
        <td>
          <div className="flex gap-2 items-center">
            {toggle ? (
              <ChevronUpIcon size={20} />
            ) : (
              <ChevronDownIcon size={20} />
            )}
            <span>{transfer.created_by.name || '--'}</span>
          </div>
        </td>
        <td>{transfer?.from_location?.name || '--'}</td>
        <td>{transfer?.to_location?.name || '--'}</td>
        <td className="text-right">{transfer.details.length}</td>
        <td>{dayjs(transfer.created_at).format('ddd DD, MMM YYYY')}</td>
        <td>
          <Badge variant={transfer.status}>{transfer.status}</Badge>
        </td>
        <td onClick={(e) => e.stopPropagation()}>
          <Dropdown>
            <Dropdown.Toggle className="mx-auto">
              <DotsHorizIcon />
            </Dropdown.Toggle>
            {transfer.status === 'pending' && (
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => handleStatusUpdate('approved')}>
                  Approve
                </Dropdown.Item>

                <Dropdown.Item
                  className="text-red-600"
                  onClick={() => handleStatusUpdate('rejected')}
                >
                  Reject
                </Dropdown.Item>

                <hr />

                <Form params={transfer} {...{ mutate }}>
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
            )}
          </Dropdown>
        </td>
      </tr>

      <Fade show={toggle} as={motion.tr}>
        <td colSpan={9} className="!p-0">
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th className="text-right">Quantity</th>
              </tr>
            </thead>
            <tbody>
              {transfer.details.map((detail, key) => (
                <tr key={key}>
                  <td>{detail.item.name}</td>
                  <td className="text-right">{detail.quantity}</td>
                </tr>
              ))}

              {transfer.notes && (
                <tr>
                  <td colSpan={2} className="!whitespace-normal">
                    <p className="font-medium">Notes:</p>
                    <p>{transfer.notes}</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </td>
      </Fade>
    </>
  );
}

export default TableRow;
