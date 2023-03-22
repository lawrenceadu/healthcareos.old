import { DotsHorizIcon } from '@healthcare/icons';
import { Confirm, Dropdown } from '@healthcareos/react';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';

import { deleteSupplierService } from '../../../../services/resource';
import { SupplierModel } from '../../../../models';
import EditForm from './Form';

export interface TableRowProps {
  supplier: SupplierModel;
  mutate: () => void;
}

function TableRow({ supplier, mutate }) {
  /**
   * functions
   */
  const handleDelete = () =>
    Confirm({
      header: 'Delete supplier',
      message: (
        <>
          You are about to delete the <b>{supplier.name}</b> supplier? Once you
          delete it you will lose it forever.
        </>
      ),
      buttons: {
        proceed: { value: 'Delete' },
      },
    }).then((proceed) => {
      if (proceed) {
        deleteSupplierService(supplier.id)
          .then(() => {
            toast.success('Delete supplier');
            mutate();
          })
          .catch((error) =>
            toast.error(error?.message || 'Unable to delete supplier')
          );
      }
    });

  return (
    <tr>
      <td>{supplier.name}</td>
      <td>{supplier.phone}</td>
      <td>{supplier.email}</td>
      <td>{supplier.address}</td>
      <td>{dayjs(supplier.created_at).format('ddd DD, MMM YYYY')}</td>
      <td>
        <Dropdown>
          <Dropdown.Toggle className="mx-auto">
            <DotsHorizIcon />
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <EditForm params={supplier} {...{ mutate }}>
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
