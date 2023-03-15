import { Confirm, Dropdown } from '@healthcareos/react';
import { DotsHorizIcon } from '@healthcare/icons';
import { toast } from 'react-toastify';

import { deleteItemCategoryService } from '../../../../../services/inventory';
import { ItemCategoryModel } from '../../../../../models';
import Form from './Form';

export interface TableRowProps {
  category: ItemCategoryModel;
  mutate: () => void;
}

function TableRow({ category, mutate }: TableRowProps) {
  /**
   * function
   */
  const handleDelete = () =>
    Confirm({
      header: 'Delete Item Category',
      message: (
        <>
          You are about to delete <b>{category.name}</b>. Once you delete it you
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
        deleteItemCategoryService(category.id)
          .then(() => {
            toast.success('Category deleted');
            mutate?.();
          })
          .catch(() => {
            toast.error('Unable to delete category');
          });
      }
    });

  return (
    <tr>
      <td>{category.name}</td>
      <td>{category.code}</td>
      <td>{category.description}</td>
      <td>
        <Dropdown>
          <Dropdown.Toggle className="mx-auto">
            <DotsHorizIcon />
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Form params={category} mutate={mutate}>
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
