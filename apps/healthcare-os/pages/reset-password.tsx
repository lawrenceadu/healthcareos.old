import { Field, Button } from '@healthcareos/react';
import { Form, Formik } from 'formik';
import { object, ref } from 'yup';
import { useRouter } from 'next/router';
import { schema, useSession } from '@healthcare/utils';
import Head from 'next/head';

import routes from '../routes';
import Layout from '../components/pages/auth/Layout';
import { resetPasswordService } from '../services/auth';

function Login() {
  /**
   * routes
   */
  const router = useRouter();

  /**
   * session
   */
  const [email, setEmail] = useSession<string>('email');
  const [otp, setOtp] = useSession<string>('otp');

  return (
    <>
      <Head>
        <title>Create new password</title>
      </Head>

      {email && otp && (
        <Layout>
          <h1 className="text-center mb-10">Create new password</h1>

          <Formik
            validateOnMount
            validationSchema={object({
              password: schema.requirePassword('Password'),
              passwordConfirm: schema
                .requirePassword('Password confirm')
                .oneOf([ref('password'), null], 'Passwords must match'),
            })}
            initialValues={{
              password: '',
              passwordConfirm: '',
            }}
            onSubmit={({ password }, { setSubmitting, setErrors }) => {
              resetPasswordService({ email, otp, password })
                .then(() => {
                  router.push(routes.auth.login);
                  setEmail(undefined);
                  setOtp(undefined);
                })
                .catch(() =>
                  setErrors({ password: 'Unable to update password' })
                )
                .finally(() => setSubmitting(false));
            }}
          >
            {({ values, isValid, isSubmitting, handleSubmit }) => (
              <Form>
                <div className="mb-10">
                  <Field.Group name="password" label="New Password">
                    <Field.Password
                      name="password"
                      value={values.password}
                      placeholder="Enter your password"
                    />
                  </Field.Group>

                  <Field.Group name="passwordConfirm" label="Password">
                    <Field.Password
                      name="passwordConfirm"
                      value={values.passwordConfirm}
                      placeholder="Enter your password"
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
                  className="w-full btn-light active:!shadow-none"
                  onClick={() => router.push(routes.auth.login)}
                >
                  Back to login
                </Button>
              </Form>
            )}
          </Formik>
        </Layout>
      )}
    </>
  );
}

export default Login;
