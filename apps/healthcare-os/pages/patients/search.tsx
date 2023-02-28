import { useContext, useEffect } from 'react';
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
  const { patient, setPatient } = useContext(PatientContext);

  /**
   * effect
   */
  useEffect(() => {
    if (patient && patient.id) {
      setPatient({});
    }
  }, [patient, setPatient]);

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
            {store.patients.map((patient, key) => (
              <tr
                key={key}
                role="button"
                onClick={() => {
                  setPatient(patient);

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
                <td>{patient.sex || '--'}</td>
                <td>
                  {dayjs(patient.date_of_birth).format('DD/MM/YYYY') +
                    ` (${dayjs().diff(patient.date_of_birth, 'year')})`}
                </td>
                <td>{patient.phone || '--'}</td>
                <td>{patient.id_number || '--'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}

export default Search;
