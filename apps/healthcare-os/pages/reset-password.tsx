import { Field, Button } from '@healthcareos/react';
import { Form, Formik } from 'formik';
import { object, ref } from 'yup';
import { useRouter } from 'next/router';
import { schema } from '@healthcare/utils';
import Head from 'next/head';

import routes from '../routes';
import Layout from '../components/pages/auth/Layout';

function Login() {
  /**
   * routes
   */
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Create new password</title>
      </Head>
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
          onSubmit={(params, { setSubmitting }) => {
            return;
          }}
        >
          {({ values, isValid, isSubmitting, handleSubmit }) => (
            <Form>
              <div className="mb-10">
                <Field.Group name="password" label="New Password">
                  <Field.Password
                    name="email"
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
    </>
  );
}

export default Login;
