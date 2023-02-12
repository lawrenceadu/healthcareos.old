import { Field, Button } from '@healthcareos/react';
import { Form, Formik } from 'formik';
import { useRouter } from 'next/router';
import { schema } from '@healthcare/utils';
import { object } from 'yup';
import Head from 'next/head';

import routes from '../routes';
import Layout from '../components/pages/auth/Layout';

function ForgottenPassword() {
  /**
   * routes
   */
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Enter OTP</title>
      </Head>

      <Layout>
        <h1 className="text-center mb-10">Enter your OTP</h1>

        <Formik
          validateOnMount
          validationSchema={object({
            otp: schema.requireOTP('OTP', 6),
          })}
          initialValues={{
            otp: '',
          }}
          onSubmit={(params, { setSubmitting }) => {
            return;
          }}
        >
          {({
            errors,
            values,
            isValid,
            isSubmitting,
            handleSubmit,
            setFieldValue,
          }) => (
            <Form>
              <div className="mb-10">
                <p className="mb-6">
                  Enter the 6-digit code sent to your phone number 020-000-1100
                </p>
                <Field.Group
                  name="otp"
                  containerClassName="border-none !shadow-none"
                >
                  <Field.Otp
                    name="otp"
                    value={values.otp}
                    onChange={(value: string) => setFieldValue('otp', value)}
                  />
                </Field.Group>
              </div>

              <Button
                type="submit"
                disabled={!isValid}
                onClick={() => handleSubmit()}
                className="w-full btn btn-primary mb-4"
                {...{ isSubmitting }}
              >
                Reset password
              </Button>
              <Button
                type="button"
                className="w-full mb-6 btn-light active:!shadow-none"
              >
                Don&apos;t receive OTP?{' '}
                <span className="underline">Resend OTP</span>
              </Button>

              <Button
                type="button"
                className="w-full btn-light active:!shadow-none"
                onClick={() => router.push(routes.auth.login)}
              >
                Back to login
              </Button>
            </Form>
          )}
        </Formik>
      </Layout>
    </>
  );
}

export default ForgottenPassword;
