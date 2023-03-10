import { useRouter } from 'next/router';
import queryString from 'query-string';
import useSWR from 'swr';
import dayjs from 'dayjs';

import { PatientModel } from '../../models';
import Skeleton from '../../components/libs/Skeleton';
import Layout from '../../components/libs/Layout';
import routes from '../../routes';

function Search() {
  /**
   * routes
   */
  const router = useRouter();
  const query = router.query;

  /**
   * api
   */
  const { data, isLoading } = useSWR<{ patients: PatientModel[] }>(
    `/patient?${queryString.stringify(
      { ...query },
      { skipEmptyString: true, skipNull: true }
    )}`
  );

  /**
   * variables
   */
  const patients = data?.patients || [];

  return (
    <Layout title="Patient" onBack>
      <div className="overflow-x-auto">
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
                {patients.map((pt, key) => (
                  <tr
                    key={key}
                    role="button"
                    onClick={() => {
                      router.push({
                        pathname: routes.dashboard.patients.details.index
                          .replace('[id]', pt.id)
                          .replace('[tab]', 'history'),
                      });
                    }}
                  >
                    <td>{pt.first_name || '--'}</td>
                    <td>{pt.middle_name || '--'}</td>
                    <td>{pt.last_name || '--'}</td>
                    <td>{pt.gender || '--'}</td>
                    <td>
                      {dayjs(pt.dob).format('DD/MM/YYYY') +
                        ` (${dayjs().diff(pt.dob, 'year')})`}
                    </td>
                    <td>{pt.phone || '--'}</td>
                    <td>{pt.id_number || '--'}</td>
                  </tr>
                ))}
              </>
            )}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}

export default Search;
