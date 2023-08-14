import { Confirm, Dropdown } from '@healthcareos/react';
import { DotsHorizIcon } from '@healthcare/icons';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';

import { deleteLocationService } from '../../../../services/resource';
import { usePermissions } from '../../../../hooks';
import { LocationModel } from '../../../../models';
import EditForm from './Form';

export interface TableRowProps {
  location: LocationModel;
  mutate: () => void;
}

function TableRow({ location, mutate }) {
  /**
   * perm
   */
  const [canEditLocation, canDeleteLocation] = usePermissions(
    'location_edit',
    'location_delete'
  );

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
      <td>{location?.department?.name || '--'}</td>
      <td>{location.created_by.name}</td>
      <td>{dayjs(location.created_at).format('ddd DD, MMM YYYY')}</td>
      <td>
        <Dropdown>
          <Dropdown.Toggle className="mx-auto">
            <DotsHorizIcon />
          </Dropdown.Toggle>
          {(canEditLocation || canDeleteLocation) && (
            <Dropdown.Menu>
              {canEditLocation && (
                <EditForm params={location} {...{ mutate }}>
                  {({ proceed }) => (
                    <Dropdown.Item onClick={() => proceed()}>
                      Update
                    </Dropdown.Item>
                  )}
                </EditForm>
              )}
              {canDeleteLocation && (
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
