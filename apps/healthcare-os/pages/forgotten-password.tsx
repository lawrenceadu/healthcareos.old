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
        <title>Reset your password</title>
      </Head>

      <Layout>
        <h1 className="mb-10">Reset your password</h1>

        <Formik
          validateOnMount
          validationSchema={object({
            email: schema.requireEmail('Email'),
          })}
          initialValues={{
            email: '',
          }}
          onSubmit={(params, { setSubmitting }) => {
            router.push(routes.auth.otp);
          }}
        >
          {({ values, isValid, isSubmitting, handleSubmit }) => (
            <Form>
              <div className="mb-10">
                <Field.Group name="email" label="Email">
                  <Field.Input
                    type="email"
                    name="email"
                    value={values.email}
                    placeholder="Enter your email address"
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

export default ForgottenPassword;
