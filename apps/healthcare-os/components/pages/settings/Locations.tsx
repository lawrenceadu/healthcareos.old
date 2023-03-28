import { useState } from 'react';
import { Button, Confirm, Dropdown, Field, Paginate } from '@healthcareos/react'; // prettier-ignore
import { DotsHorizIcon } from '@healthcare/icons';
import { toast } from 'react-toastify';
import queryString from 'query-string';
import useSWR from 'swr';
import dayjs from 'dayjs';

import { deleteLocationService } from '../../../services/settings';
import { LocationModel } from '../../../models';
import CreateForm from './Locations/Create';
import EditForm from './Locations/Edit';
import Skeleton from '../../libs/Skeleton';

export default function Locations() {
  /**
   * context
   */
  const [filters, setFilters] = useState<any>({ page: 0 });

  /**
   * api
   */
  const { data, error, mutate } = useSWR<{
    locations: LocationModel[];
    total: number;
  }>(
    `/location?${queryString.stringify({
      ...filters,
      page: filters?.page + 1,
    })}`
  );

  /**
   * variables
   */
  const locations = data?.locations || [];

  /**
   * function
   */
  const handleDelete = (location: LocationModel) =>
    Confirm({
      header: 'Delete location',
      message: (
        <>
          You are about to delete <b>{location.name}</b>? Once you delete it you
          will lose it forever.
        </>
      ),
    }).then((proceed) => {
      if (proceed) {
        deleteLocationService(location.id)
          .then(() => {
            toast.success('Location deleted');
            mutate();
          })
          .catch((error) =>
            toast.error(error?.message || 'Unable to delete location')
          );
      }
    });

  return (
    <div>
      <div className="grid md:flex gap-4 mb-6">
        <Field.Search
          onSearch={(search) =>
            setFilters((filters) => ({ ...filters, search }))
          }
        />

        <CreateForm mutate={mutate}>
          {({ proceed }) => (
            <Button
              onClick={() => proceed()}
              className="btn btn-primary w-full md:w-auto md:ml-auto"
            >
              Add new location
            </Button>
          )}
        </CreateForm>
      </div>

      <div className="overflow-x-auto mb-8">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Added by</th>
              <th>Date Added</th>
              <th className="text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {!data && !error && <Skeleton.Table count={5} />}

            {data && (
              <>
                {locations.map((location, key) => (
                  <tr key={key}>
                    <td>{location.name}</td>
                    <td>{location.type}</td>
                    <td>{location.created_by?.name}</td>
                    <td>
                      {dayjs(location.created_at).format('ddd DD, MM, YYYY')}
                    </td>
                    <td>
                      <Dropdown>
                        <Dropdown.Toggle className="mx-auto">
                          <DotsHorizIcon />
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          <EditForm {...{ location, mutate }}>
                            {({ proceed }) => (
                              <Dropdown.Item onClick={() => proceed()}>
                                Edit location
                              </Dropdown.Item>
                            )}
                          </EditForm>

                          <Dropdown.Item
                            className="text-red-600"
                            onClick={() => handleDelete(location)}
                          >
                            Delete
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </td>
                  </tr>
                ))}
              </>
            )}
          </tbody>
        </table>
      </div>

      {data && (
        <div className="flex justify-end">
          <Paginate
            page={filters?.page}
            pageCount={Math.ceil(data.total / 10)}
            setPage={(page) => setFilters((filters) => ({ ...filters, page }))}
          />
        </div>
      )}
    </div>
  );
}
