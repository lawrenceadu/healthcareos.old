import { schema, useSession } from '@healthcare/utils';
import { Field, Button } from '@healthcareos/react';
import { Form, Formik } from 'formik';
import { useRouter } from 'next/router';
import { object } from 'yup';
import Head from 'next/head';

import { UserModel } from '../models';
import { useStore } from '../hooks';
import * as api from '../services/auth';
import Layout from '../components/pages/auth/Layout';
import routes from '../routes';

function ForgottenPassword() {
  /**
   * routes
   */
  const router = useRouter();
  const page = router.query.page as string;

  /**
   * session
   */
  const [email] = useSession<string>('email');
  const [, setOTP] = useSession<string>('otp');

  /**
   * store
   */
  const { store, setStore } = useStore();

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
          onSubmit={({ otp }, { setSubmitting, setErrors }) => {
            if (page === 'reset') {
              api
                .verifyOtpService({ email, otp })
                .then(() => {
                  setOTP(otp);
                  router.push(routes.auth.reset);
                })
                .catch(() => setErrors({ otp: 'Invalid OTP' }))
                .finally(() => setSubmitting(false));
            }

            if (page === 'signup') {
              api
                .verifyAccountUsingOtpService({ otp })
                .then(({ user }: { user: UserModel }) => {
                  setStore((store) => ({ ...store, user }));
                  router.push(routes.dashboard.patients.index);
                })
                .catch(() => setErrors({ otp: 'Invalid OTP' }))
                .finally(() => setSubmitting(false));
            }
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
                  Enter the 6-digit code sent to your email{' '}
                  {email || store?.user?.email}
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
                className="w-full btn btn-primary mb-4"
                {...{ isSubmitting }}
              >
                {page === 'reset' && 'Reset password'}
                {page === 'signup' && 'Continue'}
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
