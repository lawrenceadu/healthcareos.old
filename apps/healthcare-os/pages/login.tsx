import { Field, Button } from '@healthcareos/react';
import { Form, Formik } from 'formik';
import { useRouter } from 'next/router';
import { schema } from '@healthcare/utils';
import { object } from 'yup';
import Head from 'next/head';

import { loginService } from '../services/auth';
import { UserModel } from '../models';
import { useStore } from '../hooks';
import Layout from '../components/pages/auth/Layout';
import routes from '../routes';

function Login() {
  /**
   * routes
   */
  const router = useRouter();

  /**
   * hooks
   */
  const { setStore } = useStore();

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
            username: schema.requireEmail('Email'),
            password: schema.requireString('Password'),
          })}
          initialValues={{
            username: '',
            password: '',
          }}
          onSubmit={(params, { setSubmitting, setErrors }) => {
            loginService(params)
              .then(
                ({
                  user,
                  access_token,
                }: {
                  user: UserModel;
                  access_token: string;
                }) => {
                  if (user.facilities.length === 0) {
                    return setErrors({
                      username: 'Invalid credentials provided',
                    });
                  }

                  const facility =
                    user.facilities.length === 1 ? user.facilities[0] : null;

                  setStore((store) => ({
                    ...store,
                    user,
                    token: access_token,
                    ...(facility && {
                      facility,
                      role: facility.role,
                      permissions: facility.permissions,
                    }),
                  }));

                  setTimeout(() => {
                    if (user.email_verified_at) {
                      if (user.facilities.length === 1) {
                        router.push(routes.dashboard.patients.index);
                      } else {
                        router.push(routes.auth.facility);
                      }
                    } else {
                      router.push({
                        pathname: routes.auth.otp,
                        query: { page: 'signup' },
                      });
                    }
                  });
                }
              )
              .catch((error) => {
                setErrors(
                  error?.fields || { username: 'Invalid credentials provided' }
                );
                setSubmitting(false);
              });
          }}
        >
          {({
            values,
            isValid,
            isSubmitting,
            handleSubmit,
            setFieldValue,
            setFieldTouched,
          }) => (
            <Form>
              <div className="mb-10">
                <Field.Group name="username" label="Email address">
                  <Field.Input
                    type="email"
                    name="username"
                    value={values.username}
                    placeholder="Enter you email address"
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
