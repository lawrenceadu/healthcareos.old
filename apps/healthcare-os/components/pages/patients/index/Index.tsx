import { useState } from 'react';
import { Button, Field, Paginate } from '@healthcareos/react';
import { SearchIcon } from '@healthcare/icons';
import { useRouter } from 'next/router';
import { helpers } from '@healthcare/utils';
import queryString from 'query-string';
import useSWR from 'swr';
import dayjs from 'dayjs';

import { PatientModel } from '../../../../models';
import PatientFilter from './PatientFilter';
import Skeleton from '../../../libs/Skeleton';
import routes from '../../../../routes';

function Index() {
  /**
   * state
   */
  const [filters, setFilters] = useState<any>({ page: 0 });

  /**
   * api
   */
  const { data, isLoading } = useSWR<{
    patients: PatientModel[];
    total: number;
  }>(
    `/patient?${queryString.stringify({
      ...filters,
      page: filters?.page + 1,
      per_page: 10,
    })}`
  );

  /**
   * variables
   */
  const patients = data?.patients || [];

  /**
   * routes
   */
  const router = useRouter();

  return (
    <>
      <div className={helpers.classNames('grid mb-8 md:flex md:items-center')}>
        <PatientFilter {...{ filters, setFilters }}>
          {({ proceed }) => (
            <Field.Group
              name="search"
              withFormik={false}
              wrapperClassName="!mb-0"
              containerClassName="px-4 cursor-pointer"
              onClick={() => proceed()}
            >
              <span>
                <SearchIcon className="text-gray-500" />
              </span>
              <div className="w-full md:w-[200px]">
                <p className="text-gray-500">Search...</p>
              </div>
            </Field.Group>
          )}
        </PatientFilter>

        <Button
          className="btn-outline md:ml-auto hidden md:block"
          onClick={() => router.push(routes.dashboard.patients.new)}
        >
          Add patient
        </Button>
      </div>

      <div className="table-responsive">
        <table>
          <thead>
            <tr>
              <th>First Name</th>
              <th>Middle Name</th>
              <th>Last Name</th>
              <th>Sex</th>
              <th>Date of Birth</th>
              <th>Phone Number</th>
              <th>Identity</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && <Skeleton.Table count={7} />}
            {data && (
              <>
                {!patients.length && (
                  <tr>
                    <td colSpan={7}>
                      <div className="text-center">
                        <p>No patient matches search parameters</p>
                      </div>
                    </td>
                  </tr>
                )}
                {patients.map((patient, key) => (
                  <tr
                    key={key}
                    role="button"
                    onClick={() => {
                      router.push({
                        pathname: routes.dashboard.patients.details.index
                          .replace('[id]', patient.id)
                          .replace('[tab]', 'history'),
                      });
                    }}
                  >
                    <td>{patient.first_name || '--'}</td>
                    <td>{patient.middle_name || '--'}</td>
                    <td>{patient.last_name || '--'}</td>
                    <td>{patient.gender || '--'}</td>
                    <td>
                      {dayjs(patient.dob).format('ddd DD, MMM YYYY') +
                        ` (${dayjs().diff(patient.dob, 'year')})`}
                    </td>
                    <td>{patient.phone || '--'}</td>
                    <td>{patient.ghanacard || '--'}</td>
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
    </>
  );
}

export default Index;
