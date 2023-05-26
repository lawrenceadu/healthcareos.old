import dayjs from 'dayjs';

import { DispenseModel } from '../../../../../../models/medicine';
import { useStore } from '../../../../../../hooks';

function Dispenses({ dispenses }: { dispenses: DispenseModel }) {
  /**
   * hooks
   */
  const { store } = useStore();

  /**
   * variables
   */
  const currency = store.facility.currency_symbol;

  return (
    <div className="p-6">
      <p className="mb-4 font-bold">Dispense History</p>
      <div className="overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th>Medicine</th>
              <th>Batch no</th>
              <th>Expiry date</th>
              <th>Unit price ({currency})</th>
              <th>Quantity</th>
              <th>Total ({currency})</th>
            </tr>
          </thead>
          <tbody>
            {dispenses.details.map((item, key) => (
              <tr key={key}>
                <td>{item.medicine.name}</td>
                <td>{item.batch_no}</td>
                <td>{dayjs(item.expiry_date).format('DD MMM, YYYY')}</td>
                <td>{item.unit_price}</td>
                <td>{item.quantity}</td>
                <td>{item.total}</td>
              </tr>
            ))}

            <tr className="bg-neutral-50">
              <td colSpan={2}>
                <span className="font-medium">Location:</span>{' '}
                <span>{dispenses.location.name}</span>
              </td>
              <td colSpan={2}>
                <span className="font-medium">Notes:</span>{' '}
                <span>{dispenses.notes || '--'}</span>
              </td>
              <td colSpan={2}>
                <p>
                  <span className="font-medium">Subtotal:</span>{' '}
                  {`${currency} ${dispenses.subtotal}`}
                </p>
                <p>
                  <span className="font-medium">Discount:</span>{' '}
                  {`${currency} ${dispenses.discount}`}
                </p>
                <p>
                  <span className="font-medium">Total:</span>{' '}
                  {`${currency} ${dispenses.total}`}
                </p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Dispenses;
