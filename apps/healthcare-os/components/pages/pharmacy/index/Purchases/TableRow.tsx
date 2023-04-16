import { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon, DotsHorizIcon } from '@healthcare/icons'; // prettier-ignore
import { Badge, Confirm, Dropdown, Fade } from '@healthcareos/react';
import { helpers } from '@healthcare/utils';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';

import { useStore, usePermissions } from '../../../../../hooks';
import { MedicinePurchaseModel } from '../../../../../models';
import * as api from '../../../../../services/pharmacy';
import Form from './Form';

// import ChangeForm from './Change';
// import MoveForm from './Move';

export interface TableRowProps {
  purchase: MedicinePurchaseModel;
  mutate: () => void;
}

function TableRow({ purchase, mutate }: TableRowProps) {
  /**
   * state
   */
  const [toggle, setToggle] = useState(false);

  /**
   * perm
   */
  const [canEdit, canDelete] = usePermissions(
    'medicinepurchase_edit',
    'medicinepurchase_delete'
  );

  /**
   * store
   */
  const { store } = useStore();

  /**
   * function
   */
  const handleDelete = () =>
    Confirm({
      header: 'Delete purchase',
      message: (
        <>
          You are about to delete this purchase? Once you delete it you will
          lose it forever.
        </>
      ),
      buttons: {
        proceed: {
          value: 'Delete purchase',
        },
      },
    }).then((proceed) => {
      if (proceed) {
        api
          .deleteMedicinePurchaseService(purchase.id)
          .then(() => {
            mutate?.();
            toast.success('Purchase deleted');
          })
          .catch(() => toast.error('Unabe'));
      }
    });

  const handleStatusUpdate = (status: MedicinePurchaseModel['status']) =>
    Confirm({
      header: 'Update status',
      message: (
        <>
          Are you sure you want to mark this stock as <b>{status}</b>?
        </>
      ),
      buttons: {
        proceed: { className: 'btn-primary' },
      },
    }).then((proceed) => {
      if (proceed) {
        api
          .updateMedicinePurchaseStatusService({ status }, purchase.id)
          .then(() => {
            toast.success('Purchase status updated');
            mutate?.();
          })
          .catch(() =>
            toast.error('Unable to update purchase status. Please try again')
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
          <span>{purchase.supplier.name}</span>
        </td>
        <td>{purchase.location.name}</td>
        <td className="text-right">{purchase.details.length}</td>
        <td>{dayjs(purchase.date).format('ddd DD, MMM YYYY')}</td>
        <td>{`${store.facility.currency_symbol} ${purchase.subtotal}`}</td>
        <td>{`${store.facility.currency_symbol} ${purchase.discount}`}</td>
        <td>{`${store.facility.currency_symbol} ${purchase.total}`}</td>
        <td>
          <Badge variant={purchase.status}>{purchase.status}</Badge>
        </td>
        <td onClick={(e) => e.stopPropagation()}>
          <Dropdown>
            <Dropdown.Toggle className="mx-auto">
              <DotsHorizIcon />
            </Dropdown.Toggle>
            {['pending', 'ordered'].includes(purchase.status) && (
              <Dropdown.Menu>
                {canEdit && (
                  <>
                    {purchase.status === 'pending' && (
                      <Dropdown.Item
                        onClick={() => handleStatusUpdate('ordered')}
                      >
                        Mark as ordered
                      </Dropdown.Item>
                    )}

                    {purchase.status === 'ordered' && (
                      <Dropdown.Item
                        onClick={() => handleStatusUpdate('received')}
                      >
                        Mark as received
                      </Dropdown.Item>
                    )}

                    <hr />

                    <Form params={purchase} {...{ mutate }}>
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
            )}
          </Dropdown>
        </td>
      </tr>

      <Fade as={motion.tr} show={toggle}>
        <td colSpan={9} className="!p-0">
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Batch no</th>
                <th>Expiry date</th>
                <th>Unit price</th>
                <th className="text-right">Quantity</th>
                <th>Subtotal</th>
                <th>Discount</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {purchase.details.map((detail, key) => (
                <tr key={key}>
                  <td>{detail.medicine.name}</td>
                  <td>{detail.batch_no}</td>
                  <td>
                    {dayjs(detail.expiry_date).format('ddd DD, MMM YYYY')}
                  </td>
                  <td>{`${store.facility.currency_symbol} ${detail.unit_price}`}</td>
                  <td className="text-right">{detail.quantity}</td>
                  <td>{`${store.facility.currency_symbol} ${detail.subtotal}`}</td>
                  <td>{`${store.facility.currency_symbol} ${detail.discount}`}</td>
                  <td>{`${store.facility.currency_symbol} ${detail.total}`}</td>
                </tr>
              ))}

              {purchase.notes && (
                <tr>
                  <td colSpan={8} className="!whitespace-normal">
                    <p className="font-medium">Notes:</p>
                    <p>{purchase.notes}</p>
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
