import { Field, Button } from '@healthcareos/react';
import { Form, Formik } from 'formik';
import { useRouter } from 'next/router';
import { schema } from '@healthcare/utils';
import { object } from 'yup';

import routes from '../routes';
import Layout from '../components/pages/auth/Layout';
import Head from 'next/head';

function Login() {
  /**
   * routes
   */
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Login</title>
      </Head>
      <Layout>
        <h1 className="mb-10 whitespace-nowrap">Log into your account.</h1>

        <Formik
          validateOnMount
          validationSchema={object({
            email: schema.requireEmail('Email'),
            password: schema.requireString('Password'),
          })}
          initialValues={{
            email: '',
            password: '',
          }}
          onSubmit={(params, { setSubmitting }) => {
            return;
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

                <Field.Group name="password" label="Password">
                  <Field.Password
                    name="password"
                    value={values.password}
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
                Log into your account
              </Button>
              <Button
                type="button"
                className="w-full btn-light active:!shadow-none"
                onClick={() => router.push(routes.auth.forgotten)}
              >
                Don&apos;t remember your password?{' '}
                <span className="underline">Reset it</span>
              </Button>
            </Form>
          )}
        </Formik>
      </Layout>
    </>
  );
}

export default Login;
