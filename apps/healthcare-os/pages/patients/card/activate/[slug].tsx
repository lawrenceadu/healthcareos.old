import { Button, Confirm, Field } from '@healthcareos/react';
import { helpers, schema, useSession } from '@healthcare/utils';
import { useRouter } from 'next/router';
import { Formik } from 'formik';
import { object } from 'yup';

import GenerateVirtual from '../../../../components/pages/patients/card/GenerateVirtual';
import ScanCard from '../../../../components/libs/ScanCard';
import Layout from '../../../../components/libs/Layout';
import routes from '../../../../routes';

export default function Index() {
  /**
   * routes
   */
  const router = useRouter();
  const patientId = router.query.slug as string;

  /**
   * session
   */
  const [form, setForm] = useSession<any>('onboarding_form');

  /**
   * function
   */
  const handleAfterSubmit = () =>
    Confirm({
      header: 'ID has been activated successfully',
      message:
        'The ID card was activated for this patient successfully. Would you like to add another patient?',
      buttons: {
        proceed: {
          value: 'Add another patient',
        },
        cancel: {
          className: 'btn btn-secondary',
          value: 'View patient profile',
        },
      },
    }).then((proceed) => {
      if (proceed) {
        setForm({});
        router.push(routes.dashboard.patients.new);
      } else {
        router.push({
          pathname:
            routes.dashboard.patients[
              form?.patient_type === 'inpatient' ? 'in' : 'out'
            ].index,
          query: { slug: patientId },
        });
      }
    });

  return (
    <Layout
      onBack
      title="Activate card"
      className="max-w-[544px] w-full mx-auto p-4"
    >
      <Formik
        validateOnMount
        validationSchema={object({
          digital_id: schema
            .requireString('Digital id')
            .max(12, 'Should be exactly 12 characters')
            .min(12, 'Should be exactly 12 characters'),
        })}
        initialValues={{
          digital_id: '',
        }}
        onSubmit={() => {
          handleAfterSubmit();
        }}
      >
        {({ values, isValid, isSubmitting, handleSubmit, setFieldValue }) => (
          <div
            className={helpers.classNames(
              'mb-6 pb-6',
              'border-b border-gray-200'
            )}
          >
            <ScanCard
              className="mb-6"
              onSuccess={(text, setDone) => {
                setFieldValue('digital_id', text);
                setTimeout(() => setDone());
              }}
            />

            <Field.Group name="digital_id" label="Digital ID">
              <Field.Input
                name="digital_id"
                value={values.digital_id}
                placeholder="Enter 12 digit ID"
              />
            </Field.Group>

            <Button
              type="submit"
              disabled={!isValid}
              onClick={() => handleSubmit()}
              className="w-full btn btn-primary"
              {...{ isSubmitting }}
            >
              Activate card
            </Button>
          </div>
        )}
      </Formik>

      <div className="text-center">
        <p className="text-muted mb-4">
          If you don&apos;t have cards click on the Generate virtual card button
          to generate a virtual card.
        </p>

        <GenerateVirtual>
          {({ proceed }) => (
            <Button
              onClick={() => proceed()}
              className="mx-auto bg-gray-100 text-muted"
            >
              Generate virtual card
            </Button>
          )}
        </GenerateVirtual>
      </div>
    </Layout>
  );
}
