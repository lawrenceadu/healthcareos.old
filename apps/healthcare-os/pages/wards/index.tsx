import { SpinnerIcon, ChevronRightIcon } from '@healthcare/icons';
import { helpers, schema } from '@healthcare/utils';
import { Form, Formik } from 'formik';
import { useState } from 'react';
import { object } from 'yup';
import { Field } from '@healthcareos/react';
import useSWR from 'swr';
import Link from 'next/link';

import Layout from '../../components/libs/Layout';
import routes from '../../routes';

function Index() {
  /**
   * state
   */
  const [result, setResult] = useState<{ name: string; count: number }[]>([
    { name: 'Detention ward', count: 2 },
    { name: 'Female ward 1', count: 30 },
    { name: 'Female ward 2', count: 24 },
    { name: 'Male ward 1', count: 8 },
    { name: 'Male ward 2', count: 12 },
    { name: 'Maternity ward', count: 15 },
  ]);

  /**
   * api
   */
  const { data, error } = useSWR(``);

  return (
    <Layout title="Wards">
      <div className="max-w-[512px] w-full mx-auto">
        <Formik
          validateOnMount
          validationSchema={object({
            ward: schema.requireString('Queue'),
          })}
          initialValues={{
            ward: '',
          }}
          onSubmit={(params, { setSubmitting }) => {
            // make api call here
            setTimeout(() => {
              setSubmitting(false);
            }, 2000);
          }}
        >
          {({ values, isSubmitting, setFieldValue, handleSubmit }) => (
            <Form>
              <Field.Group name="ward" label="Find a ward">
                <Field.Select
                  name="ward"
                  value={values.ward}
                  placeholder="Select a ward"
                  options={[
                    { label: 'Female ward 1', value: '1' },
                    { label: 'Female ward 2', value: '2' },
                    { label: 'Female ward 3', value: '3' },
                  ]}
                  onChange={({ value }: { value: string }) => {
                    setFieldValue('ward', value);
                    setTimeout(() => handleSubmit());
                  }}
                />
                {isSubmitting && (
                  <span className="px-4 block">
                    <SpinnerIcon />
                  </span>
                )}
              </Field.Group>
            </Form>
          )}
        </Formik>

        <div className="mt-6">
          {/* if search and no results */}
          {!result.length && <p>No results for search query</p>}

          {/* if search and results */}
          {!!result.length && (
            <>
              <div>
                {result.map((i, key) => (
                  <Link
                    key={key}
                    href={{
                      pathname: routes.dashboard.wards.details,
                      query: { id: key + 1 },
                    }}
                    className={helpers.classNames(
                      'py-3',
                      'flex items-center',
                      key !== 0 && 'border-t border-gray-300'
                    )}
                  >
                    <p className="font-bold">{i.name}</p>

                    <div className="flex items-center gap-1 ml-auto">
                      <small className="text-sm text-muted">
                        {i.count} patients
                      </small>
                      <ChevronRightIcon />
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default Index;
