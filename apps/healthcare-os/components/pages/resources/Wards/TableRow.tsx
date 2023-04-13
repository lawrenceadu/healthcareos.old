import { DotsHorizIcon } from '@healthcare/icons';
import { Confirm, Dropdown } from '@healthcareos/react';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';

import { useStore, usePermissions } from '../../../../hooks';
import { deleteWardService } from '../../../../services/resource';
import { WardModel } from '../../../../models';
import EditForm from './Form';

export interface TableRowProps {
  ward: WardModel;
  mutate: () => void;
}

function TableRow({ ward, mutate }) {
  /**
   * store
   */
  const { store } = useStore();

  /**
   * perm
   */
  const [canEdit, canDelete] = usePermissions('ward_edit', 'ward_delete');

  /**
   * functions
   */
  const handleDelete = () =>
    Confirm({
      header: 'Delete ward',
      message: (
        <>
          You are about to delete the <b>{ward.name}</b> ward? Once you delete
          it you will lose it forever.
        </>
      ),
      buttons: {
        proceed: { value: 'Delete' },
      },
    }).then((proceed) => {
      if (proceed) {
        deleteWardService(ward.id)
          .then(() => {
            toast.success('Delete ward');
            mutate();
          })
          .catch((error) =>
            toast.error(error?.message || 'Unable to delete ward')
          );
      }
    });

  return (
    <tr>
      <td>{ward.name}</td>
      <td>{ward.type}</td>
      <td className="text-right">{ward.capacity}</td>
      <td className="text-right">{ward.available}</td>
      <td>{`${store.facility.currency_symbol} ${ward.rate}`}</td>
      <td>{ward.created_by.name}</td>
      <td>{dayjs(ward.created_at).format('ddd DD, MMM YYYY')}</td>
      <td>
        <Dropdown>
          <Dropdown.Toggle className="mx-auto">
            <DotsHorizIcon />
          </Dropdown.Toggle>
          {(canEdit || canDelete) && (
            <Dropdown.Menu>
              {canEdit && (
                <EditForm params={ward} {...{ mutate }}>
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
