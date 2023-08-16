import { DotsHorizIcon } from '@healthcare/icons';
import { Confirm, Dropdown } from '@healthcareos/react';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';

import { useStore, usePermissions } from '../../../../hooks';
import { deleteChargeService } from '../../../../services/resource';
import { ChargeModel } from '../../../../models';
import EditForm from './Form';

export interface TableRowProps {
  charge: ChargeModel;
  mutate: () => void;
}

function TableRow({ charge, mutate }) {
  /**
   * store
   */
  const { store } = useStore();

  /**
   * perm
   */
  const [canEditCharge, canDeleteCharge] = usePermissions(
    'charge_edit',
    'charge_delete'
  );

  /**
   * functions
   */
  const handleDelete = () =>
    Confirm({
      header: 'Delete charge',
      message: (
        <>
          You are about to delete the <b>{charge.name}</b> charge? Once you
          delete it you will lose it forever.
        </>
      ),
      buttons: {
        proceed: { value: 'Delete' },
      },
    }).then((proceed) => {
      if (proceed) {
        deleteChargeService(charge.id)
          .then(() => {
            toast.success('Delete charge');
            mutate();
          })
          .catch((error) =>
            toast.error(error?.message || 'Unable to delete charge')
          );
      }
    });

  return (
    <tr>
      <td>{charge.name}</td>
      <td>{charge.type}</td>
      <td>{`${store.facility.currency_symbol} ${charge.regular_price}`}</td>
      <td>{`${store.facility.currency_symbol} ${charge.nhis_price}`}</td>
      <td>{`${store.facility.currency_symbol} ${charge.private_price}`}</td>
      <td>{charge.created_by.name}</td>
      <td>{dayjs(charge.created_at).format('ddd DD, MMM YYYY')}</td>
      <td>
        <Dropdown>
          <Dropdown.Toggle className="mx-auto">
            <DotsHorizIcon />
          </Dropdown.Toggle>
          {(canEditCharge || canDeleteCharge) && (
            <Dropdown.Menu>
              {canEditCharge && (
                <EditForm params={charge} {...{ mutate }}>
                  {({ proceed }) => (
                    <Dropdown.Item onClick={() => proceed()}>
                      Update
                    </Dropdown.Item>
                  )}
                </EditForm>
              )}
              {canDeleteCharge && (
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
