import dayjs from 'dayjs';

import { PrescriptionPrintModel } from '../../../../../../models';

function Prints({ prints }: { prints: PrescriptionPrintModel[] }) {
  return (
    <div className="p-6">
      <p className="mb-4 font-bold">Print History</p>
      <div className="overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th>Printed by</th>
              <th>Printed at</th>
              <th>Medicines</th>
              <th>File</th>
            </tr>
          </thead>
          <tbody>
            {prints.map((print, key) => (
              <tr key={key}>
                <td>{print.created_by.name}</td>
                <td>
                  {dayjs(print.created_at).format('DD MMM, YYYY @ h:mm a')}
                </td>
                <td>
                  {print.details
                    .map(({ medicine }) => medicine.name)
                    .join(', ')}
                </td>
                <td>
                  <a
                    target="_blank"
                    href={print.file}
                    className="text-blue-600"
                    rel="noopener noreferrer"
                  >
                    View file
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Prints;
