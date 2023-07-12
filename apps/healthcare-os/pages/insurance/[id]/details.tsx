import { Badge, Button } from '@healthcareos/react';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import useSWR from 'swr';
import dayjs from 'dayjs';

import { insuranceClaimService } from '../../../services/insurance';
import { InsuranceClaimModel } from '../../../models';
import { useStore } from '../../../hooks';
import Layout from '../../../components/libs/Layout';
import Claim from '../../../components/pages/insurance/Claim';

function Details() {
  /**
   * routes
   */
  const router = useRouter();
  const { id } = router.query;

  /**
   * store
   */
  const { store } = useStore();

  /**
   * api
   */
  const { data, mutate } = useSWR<{
    claim: InsuranceClaimModel & { claim: InsuranceClaimModel };
  }>(`/insurance/visit/${id}`);

  /**
   * variables
   */
  const isPending = data?.claim?.status === 'pending';

  const claim = data?.claim;
  const visit = claim?.visit;
  const patient = claim?.patient;
  const currency = store?.facility?.currency_symbol;
  const insurance = claim?.insurance;

  const diagnoses = isPending ? visit.diagnoses : data?.claim?.claim?.diagnoses;
  const invoices = isPending ? visit.invoices : data?.claim?.claim?.invoices;
  const histories = !isPending ? data?.claim?.claim?.history : [];

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
    <Layout title="Claims details">
      {data && (
        <>
          {claim.status === 'pending' && (
            <div className="flex justify-end mb-6">
              <Claim
                claim={claim}
                onSubmit={(params, { setSubmitting }) => {
                  insuranceClaimService(params)
                    .then(() => {
                      mutate();
                      toast.success('Claim generated.');
                    })
                    .catch((error) => toast.error(error?.message))
                    .finally(() => setSubmitting(false));
                }}
              >
                {({ proceed }) => (
                  <Button className="btn-primary" onClick={() => proceed()}>
                    Initiate Claim
                  </Button>
                )}
              </Claim>
            </div>
          )}

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
              <p className="text-lg font-semibold">Invoice</p>
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
              <p className="text-lg font-semibold">Diagnoses</p>
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
                        {dayjs(history.created_at).format(
                          'MMM DD, YYYY @ h:mm a'
                        )}
                      </td>
                      <td>{history.created_by?.name}</td>
                      <td>
                        <a
                          download={true}
                          target="download"
                          href={history.attachment}
                          className="text-xs underline text-blue-700"
                        >
                          View attactment
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </Layout>
  );
}

export default Details;
