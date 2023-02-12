import { Button, Field } from '@healthcareos/react';
import { Form, Formik } from 'formik';
import { object } from 'yup';
import { schema } from '@healthcare/utils';

function Add() {
  return (
    <Formik
      validateOnMount
      validationSchema={object({
        email: schema.requireEmail('Email'),
        role: schema.requireString('Role'),
      })}
      initialValues={{
        email: '',
        role: '',
      }}
      onSubmit={(params, { setSubmitting }) => {
        return;
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
        <Form className="">
          <div className="px-6 mb-6">
            <p className="mb-6">
              Enter the email address of the team member you would like to
              invite and then select their role
            </p>

            <Field.Group name="email" label="Email">
              <Field.Input
                type="email"
                name="email"
                value={values.email}
                placeholder="Enter email address"
              />
            </Field.Group>

            <Field.Group name="role" label="Role">
              <Field.Select
                name="role"
                value={values.role}
                options={[{ label: 'Doctor', value: 'doctor' }]}
                placeholder="Select role"
                onChange={({ value }: { value: string }) =>
                  setFieldValue('role', value)
                }
              />
            </Field.Group>
          </div>

          <div className="flex gap-6 justify-end py-3 px-6 border-t border-gray-200">
            <Button type="button" className="text-muted">
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!isValid}
              className="btn btn-primary"
              onClick={() => handleSubmit()}
              {...{ isSubmitting }}
            >
              Send invite
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}

export default Add;
