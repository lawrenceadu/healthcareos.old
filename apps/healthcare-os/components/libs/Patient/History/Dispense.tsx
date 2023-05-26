import { Accordion, Badge } from '@healthcareos/react';
import dayjs from 'dayjs';

import { DispenseModel } from '../../../../models/medicine';
import { HistoryLog } from '../../../../models/history';
import { useStore } from '../../../../hooks';

export interface DispenseProps {
  data: Omit<HistoryLog, 'details'> & { details: DispenseModel };
}

function Prescription({ data }: DispenseProps) {
  const { store } = useStore();

  /**
   * variables
   */
  const currency = store.facility.currency_code;
  const items = [
    { label: 'Location', value: data.details.location.name },
    { label: 'Sub total', value: `${currency} ${data.details.subtotal}` },
    { label: 'Discount', value: `${currency} ${data.details.discount}` },
    { label: 'Total', value: `${currency} ${data.details.total}` },
    { label: 'Dispensed by', value: data.created_by.name || '--' },
    {
      label: 'Dispensed at',
      value: dayjs(data.created_at).format('ddd DD, MMM YYYY @ hh:mma'),
    },
  ];

  return (
    <Accordion.Item
      className="py-2"
      header={
        <>
          <Badge className="bg-purple-50 text-purple-600">Dispense</Badge>
          {/* <p className="text-xs !text-blue-700">Dispense</p> */}
          <p className="text-sm font-bold mt-1">
            {data.details.details.map((i) => i.medicine.name).join(', ')}
          </p>
        </>
      }
    >
      <div className="flex flex-col">
        <div className="flex">
          <div className="flex-[0_0_120px]">
            <small className="text-muted text-sm font-medium">Medicines:</small>
          </div>
          <div className="text-sm overflow-x-auto">
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
                {data.details.details.map((detail, key) => (
                  <tr key={key}>
                    <td>{detail.medicine.name}</td>
                    <td>{detail.batch_no}</td>
                    <td>{detail.expiry_date}</td>
                    <td>{detail.unit_price}</td>
                    <td>{detail.quantity}</td>
                    <td>{detail.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {items.map((i, key) => (
          <div className="flex" key={key}>
            <div className="flex-[0_0_120px]">
              <small className="text-muted text-sm font-medium">
                {i.label}:
              </small>
            </div>
            <small className="text-sm">{i.value}</small>
          </div>
        ))}
      </div>
    </Accordion.Item>
  );
}

export default Prescription;
