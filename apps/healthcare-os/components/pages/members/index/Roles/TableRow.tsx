import { DotsHorizIcon } from '@healthcare/icons';
import { Confirm, Dropdown } from '@healthcareos/react';

import { deleteRoleService } from '../../../../../services/members';
import { RoleModel } from '../../../../../models';
import UpdateForm from './Form';
import { toast } from 'react-toastify';

export interface TableRowProps {
  role: RoleModel;
  mutate: () => void;
}

function TableRow({ role, mutate }: TableRowProps) {
  /**
   * function
   */
  const handleDelete = () =>
    Confirm({
      header: 'Delete role',
      message: (
        <>
          You are about to delete the <b>{role.name}</b> role. Once you delete
          it you will lose it forever.
        </>
      ),
      buttons: { value: 'Delete' },
    }).then((proceed) => {
      if (proceed) {
        deleteRoleService(role.id)
          .then(() => {
            toast.success('Role deleted');
            mutate();
          })
          .catch((error) => {
            toast.error(error?.message || 'Unable to delete role');
          });
      }
    });

  return (
    <tr>
      <td>{role.name || '--'}</td>
      <td>{role.code || '--'}</td>
      <td>
        {role.code !== 'admin' && (
          <Dropdown>
            <Dropdown.Toggle className="mx-auto">
              <DotsHorizIcon />
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <UpdateForm params={role} {...{ mutate }}>
                {({ proceed }) => (
                  <Dropdown.Item onClick={() => proceed()}>
                    Update
                  </Dropdown.Item>
                )}
              </UpdateForm>
              <Dropdown.Item
                className="text-red-600"
                onClick={() => handleDelete()}
              >
                Delete
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        )}
      </td>
    </tr>
  );
}

export default TableRow;
