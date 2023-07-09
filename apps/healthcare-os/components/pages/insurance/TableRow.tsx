import { Badge } from '@healthcareos/react';
import { useRouter } from 'next/router';

import { InsuranceClaimModel } from '../../../models';
import { useStore } from '../../../hooks';
import routes from '../../../routes';

export interface TableRowProps {
  mutate: () => void;
  insurance: InsuranceClaimModel;
}

function TableRow({ insurance, mutate }: TableRowProps) {
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
      onClick={() => router.push(routes.dashboard.insurance.details)}
    >
      <td>INS-20230612-00018</td>
      <td>Larry Buntus</td>
      <td>NHIS</td>
      <td>
        <Badge variant="pending">Pending</Badge>
      </td>
      <td>{`${currency} ${insurance.total}`}</td>
    </tr>
  );
}

export default TableRow;
