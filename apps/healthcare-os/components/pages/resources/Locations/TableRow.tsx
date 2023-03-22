import { DotsHorizIcon } from '@healthcare/icons';
import { Confirm, Dropdown } from '@healthcareos/react';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';

import { deleteLocationService } from '../../../../services/resource';
import { LocationModel } from '../../../../models';
import EditForm from './Form';

export interface TableRowProps {
  location: LocationModel;
  mutate: () => void;
}

function TableRow({ location, mutate }) {
  /**
   * functions
   */
  const handleDelete = () =>
    Confirm({
      header: 'Delete location',
      message: (
        <>
          You are about to delete the <b>{location.name}</b> location? Once you
          delete it you will lose it forever.
        </>
      ),
      buttons: {
        proceed: { value: 'Delete' },
      },
    }).then((proceed) => {
      if (proceed) {
        deleteLocationService(location.id)
          .then(() => {
            toast.success('Delete location');
            mutate();
          })
          .catch((error) =>
            toast.error(error?.message || 'Unable to delete location')
          );
      }
    });

  return (
    <tr>
      <td>{location.name}</td>
      <td>{location.type}</td>
      <td>{location.created_by.name}</td>
      <td>{dayjs(location.created_at).format('ddd DD, MMM YYYY')}</td>
      <td>
        <Dropdown>
          <Dropdown.Toggle className="mx-auto">
            <DotsHorizIcon />
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <EditForm params={location} {...{ mutate }}>
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
