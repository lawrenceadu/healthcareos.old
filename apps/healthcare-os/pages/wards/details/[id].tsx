import { useState } from 'react';
import { Field, Paginate } from '@healthcareos/react';
import { useRouter } from 'next/router';
import { startCase } from 'lodash';
import queryString from 'query-string';
import useSWR from 'swr';
import dayjs from 'dayjs';

import { AdmissionModel, WardModel } from '../../../models';
import DropdownFilter from '../../../components/libs/DropdownFilter';
import Skeleton from '../../../components/libs/Skeleton';
import Layout from '../../../components/libs/Layout';
import routes from '../../../routes';

function Details() {
  /**
   * state
   */
  const [filters, setFilters] = useState<any>({ page: 0 });

  /**
   * routes
   */
  const router = useRouter();
  const id = router.query.id as string;

  /**
   * api
   */
  const { data, error, mutate } = useSWR<{
    admissions: AdmissionModel[];
    ward: WardModel;
    total: number;
  }>(
    `/ward/${id}?${queryString.stringify(
      { ...filters, page: filters?.page + 1 },
      { skipEmptyString: true, skipNull: true }
    )}`
  );

  /**
   * variables
   */
  const admissions = data?.admissions || [];

  return (
    <Layout title={data?.ward?.name || '--'} onBack>
      <div className="grid md:flex gap-4 mb-6">
        <Field.Search
          onSearch={(search) =>
            setFilters((filters) => ({ ...filters, search }))
          }
        />

        <DropdownFilter
          name="All sexes"
          value={filters?.sex}
          options={[
            { label: 'Male', value: 'male' },
            { label: 'Female', value: 'female' },
          ]}
          setValue={(value: string) =>
            setFilters((filters) => ({ ...filters, sex: value }))
          }
        />
      </div>

      <div className="overflow-x-auto mb-8">
        <table>
          <thead>
            <tr>
              <th>Patient</th>
              <th>Diagnosis</th>
              <th>Date Admitted</th>
              <th>Date of Birth</th>
              <th>Sex</th>
            </tr>
          </thead>
          <tbody>
            {!data && !error && <Skeleton.Table count={7} />}

            {data && (
              <>
                {!admissions.length && (
                  <tr>
                    <td colSpan={5}>
                      <p className="text-center">No patients in this ward</p>
                    </td>
                  </tr>
                )}

                {admissions.map((ward, key) => (
                  <tr
                    key={key}
                    className="cursor-pointer"
                    onClick={() =>
                      router.push(
                        routes.dashboard.patients.details.index
                          .replace('[id]', ward.patient.id)
                          .replace('[tab]', 'history')
                      )
                    }
                  >
                    <td>
                      <div className="flex gap-2 items-center">
                        {ward.patient.triage && (
                          <span
                            className="w-2 h-2 block flex-[0_0_8px] rounded-full"
                            style={{
                              backgroundColor: ward.patient.triage.colour,
                            }}
                          />
                        )}
                        <p>{ward.patient.name}</p>
                      </div>
                    </td>
                    <td>
                      <div className="truncate max-w-[240px]">
                        {ward.diagnoses.map((i) => i.name).join(', ')}
                      </div>
                    </td>
                    <td>
                      {dayjs(ward.start_date).format('ddd DD, MMM YYYY') +
                        ` (${dayjs(ward.start_date).fromNow()})`}
                    </td>
                    <td>
                      {dayjs(ward.patient.dob).format('DD/MM/YYYY') +
                        ` (${dayjs().diff(ward.patient.dob, 'year')})`}
                    </td>
                    <td>{startCase(ward.patient.gender)}</td>
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
            setPage={(page) => setFilters((filters) => ({ ...filters, page }))}
            pageCount={Math.ceil(data.total / 10)}
          />
        </div>
      )}
    </Layout>
  );
}

export default Details;
