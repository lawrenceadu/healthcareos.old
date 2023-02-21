import { useRouter } from 'next/router';

import Layout from '../../components/libs/Layout';
import routes from '../../routes';

function Search() {
  /**
   * routes
   */
  const router = useRouter();

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
            {Array.from({ length: 2 }, (_, i) => (
              <tr
                key={i}
                role="button"
                onClick={() =>
                  router.push({
                    pathname: routes.dashboard.patients.details.index,
                    query: { id: `${i + 1}`, tab: 'history' },
                  })
                }
              >
                <td>Lawrence</td>
                <td>Kweku</td>
                <td>Adu</td>
                <td>Male</td>
                <td>22/11/1995(28)</td>
                <td>0249817978</td>
                <td>GHA-000000000-0</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}

export default Search;
