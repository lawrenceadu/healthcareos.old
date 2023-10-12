import { Badge } from '@healthcareos/react';
import dayjs from 'dayjs';

import { InsuranceClaimModel } from '../../../../models';
import { helpers } from '@healthcare/utils';
import { kebabCase } from 'lodash';

export interface DetailsProps {
  claim: InsuranceClaimModel;
  visit: InsuranceClaimModel['visit'];
  patient: InsuranceClaimModel['patient'];
  currency: string;
  mutate: () => void;
  invoices:
    | InsuranceClaimModel['visit']['invoices']
    | InsuranceClaimModel['claim']['invoices'];
  isPending: boolean;
  histories: InsuranceClaimModel['claim']['history'];
  diagnoses:
    | InsuranceClaimModel['visit']['diagnoses']
    | InsuranceClaimModel['claim']['diagnoses'];
  insurance: InsuranceClaimModel['insurance'];
  procedures:
    | InsuranceClaimModel['visit']['procedures']
    | InsuranceClaimModel['claim']['diagnoses'];
  investigations:
    | InsuranceClaimModel['visit']['investigations']
    | InsuranceClaimModel['claim']['investigations'];
  medicines:
    | InsuranceClaimModel['visit']['medicines']
    | InsuranceClaimModel['claim']['medicines'];
}

function Details({
  claim,
  visit,
  patient,
  currency,
  invoices,
  isPending,
  diagnoses,
  histories,
  insurance,
  medicines,
  procedures,
  investigations,
}: DetailsProps) {
  const cards: { label: string; items: { label: string; value: any }[] }[] = [
    {
      label: 'Patient Details',
      items: [
        { label: 'Folder number', value: patient?.folder_number },
        { label: 'Name', value: patient?.name },
        {
          label: 'Date of birth',
          value: dayjs(patient?.dob).format('MMM, DD YYYY'),
        },
        {
          label: 'Gender',
          value: patient?.gender,
        },
      ],
    },
    {
      label: 'Visitation Details',
      items: [
        {
          label: 'Visit on',
          value: dayjs(visit?.start_date).format('MMM, DD YYYY @ h:mm a'),
        },
        {
          label: 'Initiated by',
          value: visit?.created_by?.name,
        },
        {
          label: 'Visit ended on',
          value: dayjs(visit?.end_date).format('MMM, DD YYYY @ h:mm a'),
        },
      ],
    },
    {
      label: 'Insurance',
      items: [
        {
          label: 'Insurance name',
          value: insurance?.scheme_name,
        },
        {
          label: 'Membership number',
          value: insurance?.membership_number,
        },
        {
          label: 'Expiry date',
          value: dayjs(insurance?.expiry_date).format('MMM, DD YYYY'),
        },
        {
          label: 'Claim code',
          value: insurance?.claim_code,
        },
      ],
    },
    {
      label: 'Claims Details',
      items: [
        {
          label: 'Total amount',
          value: `${currency}${claim?.total}`,
        },
        {
          label: 'Status',
          value: <Badge variant={claim?.status}>{claim?.status}</Badge>,
        },
      ],
    },
  ];

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {cards.map((card, key) => (
          <div
            key={key}
            className="p-4 rounded-lg shadow border border-neutral-200"
          >
            <p className="text-lg font-semibold mb-4">{card.label}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {card.items.map((item, key) => (
                <div key={key}>
                  <p className="text-xs font-medium text-neutral-500">
                    {item.label}
                  </p>
                  {typeof item.value === 'string' ? (
                    <p className="text-sm">{item.value}</p>
                  ) : (
                    item.value
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="shadow border border-neutral-200 rounded-lg mb-6">
        <div className="p-4">
          <p className="text-lg font-bold">Invoice</p>
        </div>
        <div className="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>Reference</th>
                <th>Items</th>
                <th>Status</th>
                <th>Sub total</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {invoices?.map((invoice, key) => (
                <tr key={key}>
                  <td>{invoice.reference}</td>
                  <td>
                    {invoice.details.map((i, key) => (
                      <p key={key}>{i.description}</p>
                    ))}
                  </td>
                  <td>
                    <Badge variant={invoice.status}>{invoice.status}</Badge>
                  </td>
                  <td>
                    {currency} {invoice.subtotal}
                  </td>
                  <td>
                    {currency} {invoice.total}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="shadow border border-neutral-200 rounded-lg mb-6">
        <div className="p-4">
          <p className="text-lg font-bold">Diagnoses</p>
        </div>
        <div className="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Code</th>
                <th>GDRG</th>
              </tr>
            </thead>
            <tbody>
              {!diagnoses?.length && (
                <tr>
                  <td colSpan={3}>
                    <p className="text-center">No diagnoses</p>
                  </td>
                </tr>
              )}
              {diagnoses?.map((diagnosis, key) => (
                <tr key={key}>
                  <td>{diagnosis.name}</td>
                  <td>{diagnosis.code}</td>
                  <td>
                    {Array.isArray(diagnosis.gdrg) ? (
                      <>
                        {diagnosis.gdrg.map((item, key) => (
                          <p key={key}>
                            {item.name}({item.code})
                          </p>
                        ))}
                      </>
                    ) : (
                      `${diagnosis.gdrg?.name}(${diagnosis.gdrg.code})`
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="shadow border border-neutral-200 rounded-lg mb-6">
        <div className="p-4">
          <p className="text-lg font-bold">Medicines</p>
        </div>
        <div className="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Quantity</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {!medicines?.length && (
                <tr>
                  <td colSpan={3}>
                    <p className="text-center">No medicines</p>
                  </td>
                </tr>
              )}
              {medicines?.map(({ medicine, quantity, reference }, key) => (
                <tr key={key}>
                  <td>{medicine.name}</td>
                  <td>{quantity}</td>
                  <td>
                    <Badge variant={reference.name}>{reference.name}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="shadow border border-neutral-200 rounded-lg mb-6">
        <div className="p-4">
          <p className="text-lg font-bold">Investigations</p>
        </div>
        <div className="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Code</th>
              </tr>
            </thead>
            <tbody>
              {!investigations?.length && (
                <tr>
                  <td colSpan={2}>
                    <p className="text-center">No investigations</p>
                  </td>
                </tr>
              )}
              {investigations?.map((investigation, key) => (
                <tr key={key}>
                  <td>{investigation.investigation.name}</td>
                  <td>{investigation.investigation.code}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="shadow border border-neutral-200 rounded-lg mb-6">
        <div className="p-4">
          <p className="text-lg font-bold">Procedures</p>
        </div>
        <div className="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Code</th>
                <th>Diagnosis</th>
              </tr>
            </thead>
            <tbody>
              {!procedures?.length && (
                <tr>
                  <td colSpan={3}>
                    <p className="text-center">No procedures</p>
                  </td>
                </tr>
              )}
              {procedures?.map((procedure, key) => (
                <tr key={key}>
                  <td>{procedure.procedure.name}</td>
                  <td>{procedure.procedure.code}</td>
                  <td>{procedure.diagnosis?.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="shadow border border-neutral-200 rounded-lg mb-6">
        <div className="p-4">
          <p className="text-lg font-semibold">History</p>
        </div>
        <div className="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>Notes</th>
                <th>Status</th>
                <th>Date created</th>
                <th>Created by</th>
                <th>Attachment</th>
              </tr>
            </thead>
            <tbody>
              {!histories?.length && (
                <tr>
                  <td colSpan={5}>
                    <p className="text-center">No history</p>
                  </td>
                </tr>
              )}
              {histories?.map((history, key) => (
                <tr key={key}>
                  <td>{history.notes || '--'}</td>
                  <td>
                    <Badge variant={history.status}>{history.status}</Badge>
                  </td>
                  <td>
                    {dayjs(history.created_at).format('MMM DD, YYYY @ h:mm a')}
                  </td>
                  <td>{history.created_by?.name}</td>
                  <td>
                    <button
                      className="text-xs underline text-blue-700"
                      onClick={() =>
                        helpers.downloadFile(
                          history.attachment,
                          `${kebabCase(claim.patient.name)}-claims.xml`
                        )
                      }
                    >
                      View attactment
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default Details;
