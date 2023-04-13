import { DotsHorizIcon } from '@healthcare/icons';
import { Confirm, Dropdown } from '@healthcareos/react';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';

import { deleteDepartmentService } from '../../../../services/resource';
import { DepartmentModel } from '../../../../models';
import { usePermissions } from '../../../../hooks';
import EditForm from './Form';

export interface TableRowProps {
  department: DepartmentModel;
  mutate: () => void;
}

function TableRow({ department, mutate }) {
  /**
   * perm
   */
  const [canEditDepartment, canDeleteDepartment] = usePermissions(
    'department_edit',
    'department_delete'
  );

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
          {(canEditDepartment || canDeleteDepartment) && (
            <Dropdown.Menu>
              {canEditDepartment && (
                <EditForm params={department} {...{ mutate }}>
                  {({ proceed }) => (
                    <Dropdown.Item onClick={() => proceed()}>
                      Update
                    </Dropdown.Item>
                  )}
                </EditForm>
              )}
              {canDeleteDepartment && (
                <Dropdown.Item
                  className="text-red-600"
                  onClick={() => handleDelete()}
                >
                  Delete
                </Dropdown.Item>
              )}
            </Dropdown.Menu>
          )}
        </Dropdown>
      </td>
    </tr>
  );
}

export default TableRow;
