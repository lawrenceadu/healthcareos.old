import { SpinnerIcon, ChevronRightIcon } from '@healthcare/icons';
import { helpers, schema } from '@healthcare/utils';
import { Form, Formik } from 'formik';
import { useState } from 'react';
import { object } from 'yup';
import { toast } from 'react-toastify';
import { Field } from '@healthcareos/react';
import dayjs from 'dayjs';
import Link from 'next/link';

import { getQueueInLocationService } from '../../services/queue';
import { PatientModel } from '../../models';
import { useLocations } from '../../hooks';
import Layout from '../../components/libs/Layout';
import routes from '../../routes';

function Index() {
  /**
   * state
   */
  const [showResult, setShowResult] = useState(false);
  const [results, setResults] = useState<
    { patient: PatientModel; created_at: string }[]
  >([]);

  /**
   * hooks
   */
  const locations = useLocations();

  return (
    <Layout title="Queuing">
      <div className="max-w-[512px] w-full mx-auto">
        <Formik
          validateOnMount
          validationSchema={object({
            location: schema.requireString('Queue'),
          })}
          initialValues={{
            location: '',
          }}
          onSubmit={(params, { setSubmitting }) => {
            setShowResult(false);

            // make api call here
            getQueueInLocationService(params)
              .then(({ queue }: { queue: typeof results }) => {
                setShowResult(true);
                setResults(queue);
              })
              .catch(() => toast.error('Unable to fetch data'))
              .finally(() => setSubmitting(false));
          }}
        >
          {({ values, isSubmitting, setFieldValue, handleSubmit }) => (
            <Form>
              <Field.Group name="location" label="View queue">
                <Field.Select
                  name="location"
                  value={values.location}
                  placeholder="Select a location"
                  options={locations.map((i) => ({
                    label: i.name,
                    value: i.id,
                  }))}
                  onChange={({ value }: { value: string }) => {
                    setFieldValue('location', value);
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
            {!results.length && <p>No results for search query</p>}

            {/* if search and results */}
            {!!results.length && (
              <>
                <div className="flex justify-between items-center gap-6 mb-4">
                  <p>{results.length} patients in queue</p>
                </div>

                <div>
                  {results.map((result, key) => (
                    <Link
                      key={key}
                      href={{
                        pathname: routes.dashboard.patients.details.index
                          .replace('[id]', result.patient.id)
                          .replace('[tab]', 'history'),
                      }}
                      className={helpers.classNames(
                        'py-3',
                        'flex items-center',
                        key !== 0 && 'border-t border-gray-300'
                      )}
                    >
                      <p className="font-bold">{result.patient.name}</p>

                      <div className="flex items-center gap-1 ml-auto">
                        <small className="text-sm text-muted">
                          {dayjs(result.created_at).fromNow()}
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
