import { Accordion, Badge } from '@healthcareos/react';

import { HistoryLog, InvoiceModel } from '../../../../models';
import { useStore } from '../../../../hooks';

export interface InsuranceProps {
  data: Omit<HistoryLog, 'details'> & { details: InvoiceModel };
}

function Insurance({ data }: InsuranceProps) {
  /**
   * store
   */
  const { store } = useStore();

  /**
   * variables
   */
  const currency = store?.facility?.currency_symbol;

  return (
    <Accordion.Item
      className="py-2"
      header={
        <>
          <Badge className="bg-teal-50 text-sky-600">Invoice</Badge>
          <p className="text-sm font-bold mt-1">
            {data.details.details.map((i) => i.charge.name).join(', ')}
          </p>
        </>
      }
    >
      <div className="flex flex-col">
        <div className="text-sm overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th className="text-right">Price ({currency})</th>
                <th className="text-right">Quantity</th>
                <th className="text-right">Total ({currency})</th>
              </tr>
            </thead>
            <tbody>
              {data?.details.details.map((invoice, key) => (
                <tr key={key}>
                  <td>{invoice.charge.name}</td>
                  <td className="text-right">{invoice.unit_price}</td>
                  <td className="text-right">{invoice.quantity}</td>
                  <td className="text-right">{invoice.total}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td></td>
                <td className="text-right">
                  <b>Sub total:</b> {`${currency} ${data?.details?.subtotal}`}
                </td>
                <td className="text-right">
                  <b>Discount:</b> {`${currency} ${data?.details?.discount}`}
                </td>
                <td className="text-right">
                  <b>Total:</b> {`${currency} ${data?.details?.total}`}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </Accordion.Item>
  );
}

export default Insurance;
