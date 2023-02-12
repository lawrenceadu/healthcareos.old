import { useState } from 'react';
import { useRouter } from 'next/router';
import { Field } from '@healthcareos/react';

import DropdownFilter from '../../../components/libs/DropdownFilter';
import Layout from '../../../components/libs/Layout';
import routes from '../../../routes';

function Details() {
  /**
   * state
   */
  const [filters, setFilters] = useState<{ diagnosis: string; sex: string }>();

  /**
   * routes
   */
  const router = useRouter();

  return (
    <Layout title="Female ward 1" onBack>
      <div className="grid md:flex gap-4 mb-6">
        <Field.Search onSearch={() => null} />
        <DropdownFilter
          name="All diagnosis"
          value={filters?.diagnosis}
          options={[{ label: 'Malaria', value: 'malaria' }]}
          setValue={(value: string) =>
            setFilters((filters) => ({ ...filters, diagnosis: value }))
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

      <div className="overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th>Patient</th>
              <th>Diagnosis</th>
              <th>Days Admitted</th>
              <th>Date of Birth</th>
              <th>Sex</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 10 }, (_, i) => (
              <tr
                key={i}
                className="cursor-pointer"
                onClick={() =>
                  router.push({
                    pathname: routes.dashboard.patients.in.index,
                    query: { slug: i + 1 },
                  })
                }
              >
                <td>Allison Morgan</td>
                <td>Sun burn</td>
                <td>2</td>
                <td>14/06/1998 (24)</td>
                <td>Female</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}

export default Details;
