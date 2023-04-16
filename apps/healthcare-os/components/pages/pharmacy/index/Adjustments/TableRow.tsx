import { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon, DotsHorizIcon } from '@healthcare/icons'; // prettier-ignore
import { Badge, Confirm, Dropdown, Fade } from '@healthcareos/react';
import { helpers } from '@healthcare/utils';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';

import { MedicineAdjustmentModel } from '../../../../../models';
import { usePermissions } from '../../../../../hooks';
import * as api from '../../../../../services/inventory';
import Form from './Form';

// import ChangeForm from './Change';
// import MoveForm from './Move';

export interface TableRowProps {
  stock: MedicineAdjustmentModel;
  mutate: () => void;
}

function TableRow({ stock, mutate }: TableRowProps) {
  /**
   * state
   */
  const [toggle, setToggle] = useState(false);

  /**
   * perm
   */
  const [canEdit, canDelete] = usePermissions(
    'medicinestock_edit',
    'medicinestock_delete'
  );

  /**
   * function
   */
  const handleDelete = () =>
    Confirm({
      header: 'Delete adjustment',
      message: (
        <>
          You are about to delete this adjustment? Once you delete it you will
          lose it forever.
        </>
      ),
      buttons: {
        proceed: {
          value: 'Delete adjustment',
        },
      },
    }).then((proceed) => {
      if (proceed) {
        api
          .deleteItemAdjustmentService(stock.id)
          .then(() => {
            mutate?.();
            toast.success('Adjustment deleted');
          })
          .catch(() => toast.error('Unabe'));
      }
    });

  const handleStatusUpdate = (status: MedicineAdjustmentModel['status']) =>
    Confirm({
      header: 'Update status',
      message: (
        <>
          Are you sure you want to mark this adjustment as <b>{status}</b>?
        </>
      ),
      buttons: {
        proceed: { className: 'btn-primary' },
      },
    }).then((proceed) => {
      if (proceed) {
        api
          .updateItemAdjustmentStatusService({ status }, stock.id)
          .then(() => {
            toast.success('Adjustment status updated');
            mutate?.();
          })
          .catch(() =>
            toast.error('Unable to update adjustment status. Please try again')
          );
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
          <span>{stock.reference}</span>
        </td>
        <td>{stock.location.name}</td>
        <td className="text-right">{stock.details.length}</td>
        <td>{dayjs(stock.date).format('ddd DD, MMM YYYY')}</td>
        <td>
          <Badge variant={stock.status}>{stock.status}</Badge>
        </td>
        <td>{stock.reason}</td>
        <td>{stock.created_by.name}</td>
        <td onClick={(e) => e.stopPropagation()}>
          {['pending'].includes(stock.status) && (
            <Dropdown>
              <Dropdown.Toggle className="mx-auto">
                <DotsHorizIcon />
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {canEdit && (
                  <>
                    <Dropdown.Item
                      onClick={() => handleStatusUpdate('approved')}
                    >
                      Approve
                    </Dropdown.Item>

                    <Dropdown.Item
                      className="text-red-600"
                      onClick={() => handleStatusUpdate('rejected')}
                    >
                      Reject
                    </Dropdown.Item>

                    <hr />

                    <Form params={stock} {...{ mutate }}>
                      {({ proceed }) => (
                        <Dropdown.Item onClick={() => proceed()}>
                          Update
                        </Dropdown.Item>
                      )}
                    </Form>
                  </>
                )}

                {canDelete && (
                  <Dropdown.Item
                    className="text-red-600"
                    onClick={() => handleDelete()}
                  >
                    Delete
                  </Dropdown.Item>
                )}
              </Dropdown.Menu>
            </Dropdown>
          )}
        </td>
      </tr>

      <Fade as={motion.tr} show={toggle}>
        <td colSpan={9} className="!p-0">
          <table>
            <thead>
              <tr>
                <th>Medicine</th>
                <th className="text-right">Quantity</th>
              </tr>
            </thead>
            <tbody>
              {stock.details.map((detail, key) => (
                <tr key={key}>
                  <td>{detail.medicine.name}</td>
                  <td className="text-right">{detail.quantity}</td>
                </tr>
              ))}
              {stock.notes && (
                <tr>
                  <td colSpan={2} className="!whitespace-normal">
                    <p className="font-medium">Notes:</p>
                    <p>{stock.notes}</p>
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
