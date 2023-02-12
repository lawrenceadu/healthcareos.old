import { SpinnerIcon, SortAscIcon, ChevronRightIcon } from '@healthcare/icons';
import { helpers, schema } from '@healthcare/utils';
import { Button, Field } from '@healthcareos/react';
import { Form, Formik } from 'formik';
import { useState } from 'react';
import { object } from 'yup';
import Link from 'next/link';

import Layout from '../../components/libs/Layout';
import routes from '../../routes';

function Index() {
  /**
   * state
   */
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<string[]>([]);

  return (
    <Layout title="Queuing">
      <div className="max-w-[512px] w-full mx-auto">
        <Formik
          validateOnMount
          validationSchema={object({
            queue: schema.requireString('Queue'),
          })}
          initialValues={{
            queue: '',
          }}
          onSubmit={(params, { setSubmitting }) => {
            setShowResult(false);

            // make api call here
            setTimeout(() => {
              setResult(['Name']);
              setShowResult(true);
              setSubmitting(false);
            }, 2000);
          }}
        >
          {({ values, isSubmitting, setFieldValue, handleSubmit }) => (
            <Form>
              <Field.Group name="queue" label="View queue">
                <Field.Select
                  name="queue"
                  value={values.queue}
                  placeholder="Select a location"
                  options={[
                    { label: 'Consulting room 1', value: '1' },
                    { label: 'Consulting room 2', value: '2' },
                    { label: 'Laboratory', value: '3' },
                  ]}
                  onChange={({ value }: { value: string }) => {
                    setFieldValue('queue', value);
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

        {showResult && (
          <div className="mt-6">
            {/* if search and no results */}
            {!result.length && <p>No results for search query</p>}

            {/* if search and results */}
            {!!result.length && (
              <>
                <div className="flex justify-between items-center gap-6 mb-4">
                  <p>4 patients in queue</p>
                  <Button className="px-0 flex-[0_0_40px] h-10 !border-gray-300">
                    <SortAscIcon />
                  </Button>
                </div>

                <div>
                  {Array.from({ length: 4 }, (_, i) => (
                    <Link
                      key={i}
                      href={{
                        pathname: routes.dashboard.patients.out.index,
                        query: { slug: i + 1 },
                      }}
                      className={helpers.classNames(
                        'py-3',
                        'flex items-center',
                        i !== 0 && 'border-t border-gray-300'
                      )}
                    >
                      <p className="font-bold">Some name</p>

                      <div className="flex items-center gap-1 ml-auto">
                        <small className="text-sm text-muted">
                          0h 15 min
                        </small>
                        <ChevronRightIcon />
                      </div>
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}

export default Index;
