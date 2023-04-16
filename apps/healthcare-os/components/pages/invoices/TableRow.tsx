import { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon, DotsHorizIcon } from '@healthcare/icons'; // prettier-ignore
import { Badge, Button, Dropdown, Fade } from '@healthcareos/react';
import { useRouter } from 'next/router';
import { helpers } from '@healthcare/utils';
import { motion } from 'framer-motion';
import dayjs from 'dayjs';

import { usePermissions } from '../../../hooks';
import { InvoiceModel } from '../../../models';
import { useStore } from '../../../hooks';
import TakePayment from '../../libs/Patient/Invoice/TakePayment';
import EditForm from '../../libs/Patient/Invoice/Edit';
import routes from '../../../routes';

export interface TableRowProps {
  invoice: InvoiceModel;
  mutate: () => void;
}

function TableRow({ invoice, mutate }: TableRowProps) {
  /**
   * routes
   */
  const router = useRouter();

  /**
   * perm
   */
  const [canEdit] = usePermissions('invoice_edit');

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
  const currency = store.facility.currency_symbol;

  return (
    <>
      <tr
        role="button"
        className={helpers.classNames(toggle && 'bg-gray-50')}
        onClick={() => setToggle(!toggle)}
      >
        <td className="flex gap-2 items-center">
          {toggle ? <ChevronUpIcon size={20} /> : <ChevronDownIcon size={20} />}
          <span>{invoice.reference}</span>
        </td>
        <td>{invoice.patient.name}</td>
        <td className="text-right">{invoice.details.length}</td>
        <td>{invoice.created_by.name}</td>
        <td>{dayjs(invoice.created_at).format('ddd DD, MMM YYYY')}</td>
        <td>
          <Badge variant={invoice.status}>{invoice.status}</Badge>
        </td>
        <td>{`${currency} ${invoice.subtotal}`}</td>
        <td>{`${currency} ${invoice.discount}`}</td>
        <td>{`${currency} ${invoice.total}`}</td>
        <td className="text-center" onClick={(e) => e.stopPropagation()}>
          <Dropdown>
            <Dropdown.Toggle className="mx-auto">
              <DotsHorizIcon />
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item
                onClick={() =>
                  router.push(
                    routes.dashboard.patients.details.index
                      .replace('[id]', invoice.patient.id)
                      .replace('[tab]', 'history')
                  )
                }
              >
                View patient profile
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </td>
      </tr>

      <Fade as={motion.tr} show={toggle} className="bg-white z-[10]">
        <td colSpan={10} className="!p-0">
          <table>
            <thead>
              <tr>
                <th>Charge</th>
                <th>Department</th>
                <th>Description</th>
                <th>Unit Price</th>
                <th>Quantity</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {invoice.details.map((item, key) => (
                <tr key={key}>
                  <td>{item.charge.name}</td>
                  <td>{item.department.name}</td>
                  <td>{item.description}</td>
                  <td>{item.unit_price}</td>
                  <td>{item.quantity}</td>
                  <td>{item.total}</td>
                </tr>
              ))}

              {invoice.notes && (
                <tr>
                  <td colSpan={6}>{invoice.notes}</td>
                </tr>
              )}

              {canEdit && ['unpaid', 'draft'].includes(invoice.status) && (
                <tr>
                  <td colSpan={6}>
                    <div className="flex gap-4 justify-center w-full">
                      {!invoice.readonly && (
                        <EditForm
                          {...{ invoice, mutate, patient: invoice.patient }}
                        >
                          {({ proceed }) => (
                            <Button
                              onClick={() => proceed()}
                              className="btn-sm btn-outline !h-10"
                            >
                              Update Invoice
                            </Button>
                          )}
                        </EditForm>
                      )}
                      {invoice.status === 'unpaid' && (
                        <TakePayment {...{ invoice, mutate }}>
                          {({ proceed }) => (
                            <Button
                              type="button"
                              onClick={() => proceed()}
                              className="btn-sm btn-primary !h-10"
                            >
                              Take payment
                            </Button>
                          )}
                        </TakePayment>
                      )}
                    </div>
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
