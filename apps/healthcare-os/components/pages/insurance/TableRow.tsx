import { Badge } from '@healthcareos/react';
import { useRouter } from 'next/router';

import { InsuranceClaimModel } from '../../../models';
import { useStore } from '../../../hooks';
import routes from '../../../routes';
import dayjs from 'dayjs';

export interface TableRowProps {
  mutate: () => void;
  claim: InsuranceClaimModel;
}

function TableRow({ claim, mutate }: TableRowProps) {
  /**
   * routes
   */
  const router = useRouter();

  /**
   * store
   */
  const { store } = useStore();

  /**
   * variables
   */
  const currency = store.facility.currency_symbol;

  return (
    <tr
      role="button"
      onClick={() =>
        router.push(
          routes.dashboard.insurance.details.replace('[id]', claim.visit.id)
        )
      }
    >
      <td>
        <p className="font-bold text-neutral-500">{claim.patient.name}</p>
        <p>{claim.patient.folder_number}</p>
      </td>
      <td>
        <p>
          <b className="text-neutral-500">Started:</b>{' '}
          {dayjs(claim.visit.start_date).format('MMM, DD YYYY @ h:mm a')}
        </p>
        <p>
          <b className="text-neutral-500">Ended:</b>{' '}
          {dayjs(claim.visit.end_date).format('MMM, DD YYYY @ h:mm a')}
        </p>
      </td>
      <td>
        <p className="font-bold text-neutral-500">
          {claim.insurance.scheme_name}
        </p>
        <p>{claim.insurance.membership_number}</p>
      </td>
      <td>
        <Badge variant={claim.status}>{claim.status}</Badge>
      </td>
      <td>
        <p>
          {currency} {claim.total}
        </p>
        <p className="text-xs font-bold text-neutral-500">
          {claim.visit.invoices.length} invoices
        </p>
      </td>
    </tr>
  );
}

export default TableRow;
