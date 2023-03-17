import { Confirm, Dropdown } from '@healthcareos/react';
import { DotsHorizIcon } from '@healthcare/icons';
import { toast } from 'react-toastify';

import { deleteMedicineService } from '../../../../../services/pharmacy';
import { MedicineModel } from '../../../../../models';
import Form from './Form';

export interface TableRowProps {
  medicine: MedicineModel;
  mutate: () => void;
}

function TableRow({ medicine, mutate }: TableRowProps) {
  /**
   * function
   */
  const handleDelete = () =>
    Confirm({
      header: 'Delete Item',
      message: (
        <>
          You are about to delete <b>{medicine.name}</b>. Once you delete it you
          will lose it forever.
        </>
      ),
      buttons: {
        proceed: {
          value: 'Delete',
          className: 'btn-error',
        },
      },
    }).then((proceed) => {
      if (proceed) {
        deleteMedicineService(medicine.id)
          .then(() => {
            toast.success('Medicine deleted');
            mutate?.();
          })
          .catch(() => {
            toast.error('Unable to delete medicine');
          });
      }
    });

  return (
    <tr>
      <td>{medicine.name}</td>
      <td>{medicine.code}</td>
      <td>{medicine.category.name}</td>
      <td>{medicine.group}</td>
      <td>{medicine.unit}</td>
      <td className="text-right">{medicine.minimum_level}</td>
      <td className="text-right">{medicine.reorder_level}</td>
      <td>
        <Dropdown>
          <Dropdown.Toggle className="mx-auto">
            <DotsHorizIcon />
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Form params={medicine} mutate={mutate}>
              {({ proceed }) => (
                <Dropdown.Item onClick={() => proceed()}>Update</Dropdown.Item>
              )}
            </Form>
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
