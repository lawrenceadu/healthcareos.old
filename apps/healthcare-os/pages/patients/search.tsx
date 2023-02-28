import { useContext } from 'react';
import { useRouter } from 'next/router';
import dayjs from 'dayjs';

import { PatientContext } from '../../contexts/Patient';
import Layout from '../../components/libs/Layout';
import routes from '../../routes';
import store from '../../store';

function Search() {
  /**
   * routes
   */
  const router = useRouter();

  /**
   * context
   */
  const { setPatient } = useContext(PatientContext);

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
            {store.patients.map((pt, key) => (
              <tr
                key={key}
                role="button"
                onClick={() => {
                  setPatient(pt);

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
                <td>{pt.sex || '--'}</td>
                <td>
                  {dayjs(pt.date_of_birth).format('DD/MM/YYYY') +
                    ` (${dayjs().diff(pt.date_of_birth, 'year')})`}
                </td>
                <td>{pt.phone || '--'}</td>
                <td>{pt.id_number || '--'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}

export default Search;
