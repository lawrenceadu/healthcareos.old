import { DotsHorizIcon } from '@healthcare/icons';
import { Confirm, Dropdown } from '@healthcareos/react';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';

import { deleteDiagnosisService } from '../../../../services/resource';
import { DiagnosisModel } from '../../../../models';
import EditForm from './Form';

export interface TableRowProps {
  diagnosis: DiagnosisModel;
  mutate: () => void;
}

function TableRow({ diagnosis, mutate }) {
  /**
   * functions
   */
  const handleDelete = () =>
    Confirm({
      header: 'Delete diagnosis',
      message: (
        <>
          You are about to delete the <b>{diagnosis.name}</b> diagnosis? Once
          you delete it you will lose it forever.
        </>
      ),
      buttons: {
        proceed: { value: 'Delete' },
      },
    }).then((proceed) => {
      if (proceed) {
        deleteDiagnosisService(diagnosis.id)
          .then(() => {
            toast.success('Delete diagnosis');
            mutate();
          })
          .catch((error) =>
            toast.error(error?.message || 'Unable to delete diagnosis')
          );
      }
    });

  return (
    <tr>
      <td>{diagnosis.name}</td>
      <td>{diagnosis.code}</td>
      <td>{dayjs(diagnosis.created_at).format('ddd DD, MMM YYYY')}</td>
      <td>
        <Dropdown>
          <Dropdown.Toggle className="mx-auto">
            <DotsHorizIcon />
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <EditForm params={diagnosis} {...{ mutate }}>
              {({ proceed }) => (
                <Dropdown.Item onClick={() => proceed()}>Update</Dropdown.Item>
              )}
            </EditForm>
            <Dropdown.Item
              className="text-red-600"
              onClick={() => handleDelete()}
            >
              Delete
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </td>
    </tr>
  );
}

export default TableRow;
