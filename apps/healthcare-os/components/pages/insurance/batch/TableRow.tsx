import { Badge, Confirm, Dropdown } from '@healthcareos/react';
import { DotsHorizIcon } from '@healthcare/icons';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';

import { InsuranceBatchModel } from '../../../../models';
import * as api from '../../../../services/insurance';
import routes from '../../../../routes';
import Update from './Update';
import { helpers } from '@healthcare/utils';
import { kebabCase } from 'lodash';

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
        api
          .deleteInsuranceClaimBatchService(batch.id)
          .then(() => {
            mutate();
            toast.success('Batch deleted');
          })
          .catch(() => toast.error('Unable to delete batch'));
      }
    });

  const handleExport = () =>
    Confirm({
      message:
        'Are you sure you want to export this batch? Once you export, you cannot add new claims to it',
      header: 'Export Batch',
      buttons: {
        proceed: {
          className: 'btn-primary',
        },
      },
    }).then((proceed) => {
      if (proceed) {
        toast.info(
          'Generating claims file, this should take a few seconds. Thanks'
        );
        api.exportInsuranceClaimBatchService(batch.id);
        setTimeout(() => mutate(), 5 * 1000);
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
      <td>{batch.created_by?.name || '--'}</td>
      <td>{dayjs(batch.created_at).format('MMM, DD YYYY @ h:mm a')}</td>
      <td onClick={(e) => e.stopPropagation()}>
        {batch.attachment ? (
          <button
            className="text-blue-600 underline"
            onClick={() =>
              helpers.downloadFile(
                batch.attachment,
                `${kebabCase(batch.title)}-claims.xml`
              )
            }
          >
            download file
          </button>
        ) : (
          '--'
        )}
      </td>
      <td onClick={(e) => e.stopPropagation()}>
        {batch.status === 'open' && (
          <Dropdown>
            <Dropdown.Toggle>
              <DotsHorizIcon />
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => handleExport()}>
                Export
              </Dropdown.Item>
              <hr />
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
