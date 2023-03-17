import { Confirm, Dropdown } from '@healthcareos/react';
import { DotsHorizIcon } from '@healthcare/icons';
import { toast } from 'react-toastify';

import { deleteItemService } from '../../../../../services/inventory';
import { ItemModel } from '../../../../../models';
import Form from './Form';

export interface TableRowProps {
  item: ItemModel;
  mutate: () => void;
}

function TableRow({ item, mutate }: TableRowProps) {
  /**
   * function
   */
  const handleDelete = () =>
    Confirm({
      header: 'Delete Item',
      message: (
        <>
          You are about to delete <b>{item.name}</b>. Once you delete it you
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
        deleteItemService(item.id)
          .then(() => {
            toast.success('Item deleted');
            mutate?.();
          })
          .catch(() => {
            toast.error('Unable to delete item');
          });
      }
    });

  return (
    <tr>
      <td>{item.name}</td>
      <td>{item.code}</td>
      <td>{item.category.name}</td>
      <td>{item.group}</td>
      <td>{item.unit}</td>
      <td className='text-right'>{item.quantity}</td>
      <td className="text-right">{item.minimum_level}</td>
      <td className="text-right">{item.reorder_level}</td>
      <td>
        <Dropdown>
          <Dropdown.Toggle className="mx-auto">
            <DotsHorizIcon />
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Form params={item} mutate={mutate}>
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
