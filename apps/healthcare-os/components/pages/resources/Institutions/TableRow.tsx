import { Dropdown, Confirm } from '@healthcareos/react';
import { DotsHorizIcon } from '@healthcare/icons';
import { toast } from 'react-toastify';

import { deleteInstitutionService } from '../../../../services/resource';
import { InstitutionModel } from '../../../../models/institution';
import { usePermissions } from '../../../../hooks';
import Form from './Form';

export interface TableRowsProps {
  institution: InstitutionModel;
  mutate: () => void;
}

function TableRow({ institution, mutate }: TableRowsProps) {
  /**
   * perm
   */
  const [canEdit, canDelete] = usePermissions(
    'institution_edit',
    'institution_delete'
  );

  /**
   * functions
   */
  const handleDelete = () =>
    Confirm({
      header: 'Delete institution',
      message: (
        <>
          You are about to delete <b>{institution.name}</b> institution? Once
          you delete it you will lose it forever.
        </>
      ),
      buttons: {
        proceed: { value: 'Delete institution' },
      },
    }).then((proceed) => {
      if (proceed) {
        deleteInstitutionService(institution.id)
          .then(() => {
            toast.success('Institution deleted');
            mutate();
          })
          .catch((error) =>
            toast.error(error?.message || 'Unable to delete institution')
          );
      }
    });

  return (
    <tr>
      <td>{institution.name}</td>
      <td>{institution.email}</td>
      <td>{institution.phone}</td>
      <td>{institution.address}</td>
      <td>
        <Dropdown>
          <Dropdown.Toggle className="mx-auto">
            <DotsHorizIcon />
          </Dropdown.Toggle>
          {(canEdit || canDelete) && (
            <Dropdown.Menu>
              {canEdit && (
                <Form params={institution} mutate={mutate}>
                  {({ proceed }) => (
                    <Dropdown.Item onClick={() => proceed()}>
                      Update
                    </Dropdown.Item>
                  )}
                </Form>
              )}
              {canDelete && (
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
