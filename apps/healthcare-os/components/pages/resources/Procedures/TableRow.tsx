import { DotsHorizIcon } from '@healthcare/icons';
import { Confirm, Dropdown } from '@healthcareos/react';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';

import { deleteProcedureService } from '../../../../services/resource';
import { usePermissions, useStore } from '../../../../hooks';
import { ProcedureModel } from '../../../../models';
import EditForm from './Form';

export interface TableRowProps {
  procedure: ProcedureModel;
  mutate: () => void;
}

function TableRow({ procedure, mutate }) {
  /**
   * perm
   */
  const [canEdit, canDelete] = usePermissions(
    'procedure_edit',
    'procedure_delete'
  );

  /**
   * store
   */
  const { store } = useStore();

  /**
   * variables
   */
  const currency = store?.facility?.currency_symbol;

  /**
   * functions
   */
  const handleDelete = () =>
    Confirm({
      header: 'Delete procedure',
      message: (
        <>
          You are about to delete the <b>{procedure.name}</b> procedure? Once
          you delete it you will lose it forever.
        </>
      ),
      buttons: {
        proceed: { value: 'Delete' },
      },
    }).then((proceed) => {
      if (proceed) {
        deleteProcedureService(procedure.id)
          .then(() => {
            toast.success('Delete procedure');
            mutate();
          })
          .catch((error) =>
            toast.error(error?.message || 'Unable to delete procedure')
          );
      }
    });

  return (
    <tr>
      <td>{procedure.name}</td>
      <td>{procedure.code}</td>
      <td className="text-sm">
        <p>
          <b>NHIS:</b> {`${currency} ${procedure.nhis_price || 0}`}
        </p>
        <p>
          <b>Regular:</b> {`${currency} ${procedure.regular_price || 0}`}
        </p>
        <p>
          <b>Private:</b> {`${currency} ${procedure.private_price || 0}`}
        </p>
      </td>
      <td>{dayjs(procedure.created_at).format('ddd DD, MMM YYYY')}</td>
      <td>
        <Dropdown>
          <Dropdown.Toggle className="mx-auto">
            <DotsHorizIcon />
          </Dropdown.Toggle>
          {(canEdit || canDelete) && (
            <Dropdown.Menu>
              {canEdit && (
                <EditForm params={procedure} {...{ mutate }}>
                  {({ proceed }) => (
                    <Dropdown.Item onClick={() => proceed()}>
                      Update
                    </Dropdown.Item>
                  )}
                </EditForm>
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
