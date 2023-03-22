import { DotsHorizIcon } from '@healthcare/icons';
import { Confirm, Dropdown } from '@healthcareos/react';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';

import { deleteTriageService } from '../../../../services/resource';
import { TriageModel } from '../../../../models';
import EditForm from './Form';

export interface TableRowProps {
  triage: TriageModel;
  mutate: () => void;
}

function TableRow({ triage, mutate }) {
  /**
   * functions
   */
  const handleDelete = () =>
    Confirm({
      header: 'Delete triage',
      message: (
        <>
          You are about to delete the <b>{triage.name}</b> triage? Once you
          delete it you will lose it forever.
        </>
      ),
      buttons: {
        proceed: { value: 'Delete' },
      },
    }).then((proceed) => {
      if (proceed) {
        deleteTriageService(triage.id)
          .then(() => {
            toast.success('Delete triage');
            mutate();
          })
          .catch((error) =>
            toast.error(error?.message || 'Unable to delete triage')
          );
      }
    });

  return (
    <tr>
      <td>{triage.name}</td>
      <td>{triage.code}</td>
      <td>
        <span
          className="block h-4 w-8 rounded"
          style={{ backgroundColor: triage.colour }}
        />
      </td>
      <td>
        <div>{triage.description}</div>
      </td>
      <td>{dayjs(triage.created_at).format('ddd DD, MMM YYYY')}</td>
      <td>
        <Dropdown>
          <Dropdown.Toggle className="mx-auto">
            <DotsHorizIcon />
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <EditForm params={triage} {...{ mutate }}>
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
