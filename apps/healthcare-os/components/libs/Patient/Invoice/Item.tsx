import { Accordion, Badge, Button, Confirm } from '@healthcareos/react';
import { DeleteIcon } from '@healthcare/icons';
import { helpers } from '@healthcare/utils';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';

import { deletePatientInvoiceService } from '../../../../services/patient';
import { useStore, usePermissions } from '../../../../hooks';
import { InvoiceModel } from '../../../../models';
import TakePayment from './TakePayment';
import EditForm from './Edit';

export interface ItemProps {
  mutate: () => void;
  invoice: InvoiceModel;
}

function Item({ mutate, invoice }: ItemProps) {
  /**
   * store
   */
  const { store } = useStore();

  /**
   * perm
   */
  const [canEdit, canDelete] = usePermissions('invoice_edit', 'invoice_delete');

  /**
   * function
   */
  const handleDelete = () =>
    Confirm({
      header: 'Delete invoice',
      message:
        'You are about to delete this voice. Once you delete it you will lose it forever.',
      buttons: {
        proceed: {
          value: 'Delete invoice',
        },
      },
    }).then((proceed) => {
      if (proceed) {
        deletePatientInvoiceService(invoice.id)
          .then(() => {
            toast.success('Invoice deleted');
            mutate();
          })
          .catch((error) =>
            toast.error(error?.message || 'Unable to delete invoice')
          );
      }
    });

  return (
    <Accordion.Item
      actions={
        <>
          <Badge variant={invoice.status}>{invoice.status}</Badge>
          {canDelete && !invoice.readonly && invoice.status === 'unpaid' && (
            <Button className="!h-auto px-0" onClick={() => handleDelete()}>
              <DeleteIcon size={20} />
            </Button>
          )}
        </>
      }
      className="rounded-lg p-4 border border-gray-200 font-medium"
      header={<p className="text-lg font-bold">{invoice.reference}</p>}
    >
      <div className="grid gap-4">
        <div>
          <p className="text-sm">
            Invoiced on {dayjs(invoice.created_at).format('DD MMM. YYYY')} by{' '}
            {invoice.created_by.name}
          </p>
        </div>
        <div>
          {invoice.details.map((detail, key) => (
            <div
              key={key}
              className={helpers.classNames(
                'grid grid-cols-2 gap-x-4 gap-y-2 py-4',
                key !== 0 && 'border-t border-gray-200'
              )}
            >
              {[
                {
                  label: 'Item',
                  value: detail?.charge?.name || '--',
                },
                {
                  label: 'Revenue dept',
                  value: detail?.department?.name || '--',
                },
                { label: 'Quantity', value: detail.quantity },
                {
                  label: 'Price',
                  value: `${store.facility.currency_symbol} ${detail.unit_price}`,
                },
                {
                  label: 'Total',
                  value: `${store.facility.currency_symbol} ${detail.total}`,
                },
              ].map((i, key) => (
                <div key={key}>
                  <p className="text-xs text-gray-600">{i.label}</p>
                  <p className="text-sm">{i.value}</p>
                </div>
              ))}
            </div>
          ))}
        </div>

        <div>
          <p className="text-sm mb-1 font-bold">Invoice summary</p>

          <div
            className={helpers.classNames('grid grid-cols-3 gap-x-4 gap-y-2')}
          >
            {[
              {
                label: 'Total',
                value: `${store.facility.currency_symbol} ${invoice.subtotal}`,
              },
              {
                label: 'Discount',
                value: `${store.facility.currency_symbol} ${invoice.discount}`,
              },
              {
                label: 'Balance',
                value: `${store.facility.currency_symbol} ${invoice.total}`,
              },
            ].map((i, key) => (
              <div key={key}>
                <p className="text-xs text-gray-600">{i.label}</p>
                <p className="text-sm">{i.value}</p>
              </div>
            ))}
          </div>
        </div>

        {canEdit && ['unpaid', 'draft'].includes(invoice.status) && (
          <div className="flex gap-4 justify-end">
            {!invoice.readonly && (
              <EditForm {...{ invoice, mutate }}>
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
        )}
      </div>
    </Accordion.Item>
  );
}

export default Item;
