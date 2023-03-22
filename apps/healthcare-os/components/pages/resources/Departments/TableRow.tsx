import { DotsHorizIcon } from '@healthcare/icons';
import { Confirm, Dropdown } from '@healthcareos/react';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';

import { deleteDepartmentService } from '../../../../services/resource';
import { DepartmentModel } from '../../../../models';
import EditForm from './Form';

export interface TableRowProps {
  department: DepartmentModel;
  mutate: () => void;
}

function TableRow({ department, mutate }) {
  /**
   * functions
   */
  const handleDelete = () =>
    Confirm({
      header: 'Delete department',
      message: (
        <>
          You are about to delete the <b>{department.name}</b> department? Once
          you delete it you will lose it forever.
        </>
      ),
      buttons: {
        proceed: { value: 'Delete' },
      },
    }).then((proceed) => {
      if (proceed) {
        deleteDepartmentService(department.id)
          .then(() => {
            toast.success('Delete department');
            mutate();
          })
          .catch((error) =>
            toast.error(error?.message || 'Unable to delete department')
          );
      }
    });

  return (
    <tr>
      <td>{department.name}</td>
      <td>{department.head.name}</td>
      <td>{department.created_by.name}</td>
      <td>{dayjs(department.created_at).format('ddd DD, MMM YYYY')}</td>
      <td>
        <Dropdown>
          <Dropdown.Toggle className="mx-auto">
            <DotsHorizIcon />
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <EditForm params={department} {...{ mutate }}>
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
