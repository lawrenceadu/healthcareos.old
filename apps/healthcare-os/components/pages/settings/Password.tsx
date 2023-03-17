import { Button, Field } from '@healthcareos/react';
import { Form, Formik } from 'formik';
import { object, ref } from 'yup';
import { schema } from '@healthcare/utils';
import { toast } from 'react-toastify';

import { updatePasswordService } from '../../../services/settings';

export default function Password() {
  return (
    <div className="max-w-[360px]">
      <Formik
        validateOnMount
        validationSchema={object({
          current_password: schema.requireString('Password'),
          new_password: schema.requirePassword('New Password'),
          confirm_password: schema
            .requirePassword('Password confirm')
            .oneOf([ref('new_password'), null], 'Passwords must match'),
        })}
        initialValues={{
          current_password: '',
          new_password: '',
          confirm_password: '',
        }}
        onSubmit={(params, { setSubmitting, setErrors, resetForm }) => {
          updatePasswordService(params)
            .then(() => {
              toast.success('Password updated');
              resetForm({});
            })
            .catch((error) =>
              setErrors(
                error?.fields || { current_password: 'Password is incorrect' }
              )
            )
            .finally(() => setSubmitting(false));
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

              <Field.Group name="new_password" label="New password">
                <Field.Password
                  name="new_password"
                  value={values.new_password}
                  placeholder="Enter your new password"
                />
              </Field.Group>

              <Field.Group name="confirm_password" label="Confirm password">
                <Field.Password
                  name="confirm_password"
                  value={values.confirm_password}
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
