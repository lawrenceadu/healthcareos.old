import { Accordion, Badge, Button } from '@healthcareos/react';
import { helpers } from '@healthcare/utils';
import dayjs from 'dayjs';

import { InvoiceModel } from '../../../../models';
import { useStore } from '../../../../hooks';
import EditForm from './Edit';

export interface ItemProps {
  invoice: InvoiceModel;
}

function Item({ invoice }: ItemProps) {
  /**
   * store
   */
  const { store } = useStore();

  return (
    <Accordion.Item
      actions={<Badge variant={invoice.status}>{invoice.status}</Badge>}
      className="rounded-lg p-4 border border-gray-200 font-medium"
      header={<p className="text-lg font-bold">Invoice {invoice.reference}</p>}
    >
      <div className="grid gap-4">
        <div>
          {/* <p className="text-xs text-green-600">Outpatient</p> */}
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
                'grid grid-cols-2 gap-x-4 gap-y-2 py-1',
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

        {/* <div>
          <p className="text-sm mb-1 font-bold">Insurance</p>

          <div
            key={i}
            className={helpers.classNames('grid grid-cols-2 gap-x-4 gap-y-2')}
          >
            {[
              {
                label: 'Item',
                value: 'Nationwide Medical Insurance',
              },
              { label: 'Amount', value: 'Ghs 20.00' },
            ].map((i, key) => (
              <div key={key}>
                <p className="text-xs text-gray-600">{i.label}</p>
                <p className="text-sm">{i.value}</p>
              </div>
            ))}
          </div>
        </div> */}

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
                label: 'Insurance',
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

        {['unpaid', 'draft'].includes(invoice.status) && (
          <div className="flex gap-4 justify-end">
            <EditForm invoice={invoice}>
              {({ proceed }) => (
                <Button
                  onClick={() => proceed()}
                  className="btn-sm btn-outline !h-10"
                >
                  Update Invoice
                </Button>
              )}
            </EditForm>
            {invoice.status === 'unpaid' && (
              <Button className="btn-sm btn-primary !h-10">Take payment</Button>
            )}
          </div>
        )}
      </div>
    </Accordion.Item>
  );
}

export default Item;
