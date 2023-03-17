import { ChevronRightIcon } from '@healthcare/icons';
import { useRouter } from 'next/router';
import { helpers } from '@healthcare/utils';
import { Field } from '@healthcareos/react';
import useSWR from 'swr';
import Link from 'next/link';

import { WardModel } from '../../models';
import SearchSelect from '../../components/libs/SearchSelect';
import Layout from '../../components/libs/Layout';
import routes from '../../routes';

function Index() {
  /**
   * api
   */
  const { data, error } = useSWR<{ wards: WardModel[] }>(`/ward?per_page=10`);

  /**
   * variables
   */
  const wards = data?.wards || [];

  /**
   * routes
   */
  const router = useRouter();

  return (
    <Layout title="Wards">
      <div className="max-w-[512px] w-full mx-auto">
        <Field.Group name="ward" label="Find a ward" withFormik={false}>
          <SearchSelect.Wards
            onChange={(value) =>
              router.push(
                routes.dashboard.wards.details.replace('[id]', value.value)
              )
            }
          />
        </Field.Group>

        <div className="mt-6">
          {!data && !error && (
            <div className="grid gap-6">
              {Array.from({ length: 5 }, (_, i) => (
                <div
                  key={i}
                  className="h-[14px] rounded bg-neutral-100 animate-pulse"
                />
              ))}
            </div>
          )}

          {data && (
            <>
              {/* if search and no results */}
              {!wards.length && <p>No results for search query</p>}

              {/* if search and results */}

              {wards.map((ward, key) => (
                <Link
                  key={key}
                  href={routes.dashboard.wards.details.replace('[id]', ward.id)}
                  className={helpers.classNames(
                    'py-3',
                    'flex items-center',
                    key !== 0 && 'border-t border-gray-300'
                  )}
                >
                  <p className="font-bold">{ward.name}</p>

                  <div className="flex items-center gap-1 ml-auto">
                    <small className="text-sm text-muted">
                      {ward.capacity - ward.available} patients
                    </small>
                    <ChevronRightIcon />
                  </div>
                </Link>
              ))}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default Index;
