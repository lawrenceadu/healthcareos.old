import { DotsHorizIcon } from '@healthcare/icons';
import { Confirm, Dropdown } from '@healthcareos/react';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';

import { deleteInvestigationService } from '../../../../services/resource';
import { InvestigationModel } from '../../../../models';
import EditForm from './Form';

export interface TableRowProps {
  investigation: InvestigationModel;
  mutate: () => void;
}

function TableRow({ investigation, mutate }) {
  /**
   * functions
   */
  const handleDelete = () =>
    Confirm({
      header: 'Delete investigation',
      message: (
        <>
          You are about to delete the <b>{investigation.name}</b> investigation?
          Once you delete it you will lose it forever.
        </>
      ),
      buttons: {
        proceed: { value: 'Delete' },
      },
    }).then((proceed) => {
      if (proceed) {
        deleteInvestigationService(investigation.id)
          .then(() => {
            toast.success('Delete investigation');
            mutate();
          })
          .catch((error) =>
            toast.error(error?.message || 'Unable to delete investigation')
          );
      }
    });

  return (
    <tr>
      <td>{investigation.name}</td>
      <td>{investigation.code}</td>
      <td>{dayjs(investigation.created_at).format('ddd DD, MMM YYYY')}</td>
      <td>
        <Dropdown>
          <Dropdown.Toggle className="mx-auto">
            <DotsHorizIcon />
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <EditForm params={investigation} {...{ mutate }}>
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
