import { schema } from '@healthcare/utils';
import { Button, Field } from '@healthcareos/react';
import { Form, Formik } from 'formik';
import { object, ref } from 'yup';

export default function Password() {
  return (
    <div className="max-w-[360px]">
      <Formik
        validateOnMount
        validationSchema={object({
          current_password: schema.requireString('Password'),
          password: schema.requirePassword('New Password'),
          password_confirm: schema
            .requirePassword('Password confirm')
            .oneOf([ref('password'), null], 'Passwords must match'),
        })}
        initialValues={{
          current_password: '',
          password: '',
          password_confirm: '',
        }}
        onSubmit={() => {
          return;
        }}
      >
        {({ values, isValid, isSubmitting, handleSubmit }) => (
          <Form>
            <div className="mb-10">
              <Field.Group name="current_password" label="Current password">
                <Field.Password
                  name="current_password"
                  value={values.current_password}
                  placeholder="Enter your current password"
                />
              </Field.Group>

              <Field.Group name="password" label="New password">
                <Field.Password
                  name="password"
                  value={values.password}
                  placeholder="Enter your new password"
                />
              </Field.Group>

              <Field.Group name="password_confirm" label="Confirm password">
                <Field.Password
                  name="password_confirm"
                  value={values.password_confirm}
                  placeholder="Repeat your new password"
                />
              </Field.Group>
            </div>

            <Button
              type="submit"
              disabled={!isValid}
              className="btn btn-primary"
              onClick={() => handleSubmit()}
              {...{ isSubmitting }}
            >
              Reset password
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
