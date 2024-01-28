import { Badge, Confirm, Dropdown } from '@healthcareos/react';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';

import { deleteInsuranceClaimBatchService } from '../../../../services/insurance';
import { InsuranceBatchModel } from '../../../../models';
import routes from '../../../../routes';
import { DotsHorizIcon } from '@healthcare/icons';
import Update from './Update';

export interface TableRowProps {
  mutate: () => void;
  batch: InsuranceBatchModel;
}

function TableRow({ mutate, batch }: TableRowProps) {
  /**
   * routes
   */
  const router = useRouter();

  /**
   * functions
   */
  const handleDelete = () =>
    Confirm({
      message: 'Are you sure you want to delete this batch?',
      header: 'Delete Batch',
    }).then((proceed) => {
      if (proceed) {
        deleteInsuranceClaimBatchService(batch.id)
          .then(() => {
            mutate();
            toast.success('Batch deleted');
          })
          .catch(() => toast.error('Unable to delete batch'));
      }
    });

  return (
    <tr
      role="button"
      onClick={() =>
        router.push(
          routes.dashboard.insurance.batch.details.replace('[id]', batch.id)
        )
      }
    >
      <td>{batch.title}</td>
      <td className="text-right">{batch.no_claims}</td>
      <td>
        <Badge variant={batch.status === 'open' ? 'pending' : 'success'}>
          {batch.status}
        </Badge>
      </td>
      <td>--</td>
      <td>{dayjs(batch.created_at).format('MMM, DD YYYY @ h:mm a')}</td>
      <td onClick={(e) => e.stopPropagation()}>
        {batch.status === 'open' && (
          <Dropdown>
            <Dropdown.Toggle>
              <DotsHorizIcon />
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Update batch={batch} onSuccess={() => mutate()}>
                {({ proceed }) => (
                  <Dropdown.Item onClick={() => proceed()}>Edit</Dropdown.Item>
                )}
              </Update>
              {batch.status === 'open' && !batch.no_claims && (
                <Dropdown.Item
                  className="text-red-600"
                  onClick={() => handleDelete()}
                >
                  Delete
                </Dropdown.Item>
              )}
            </Dropdown.Menu>
          </Dropdown>
        )}
      </td>
    </tr>
  );
}

export default TableRow;
