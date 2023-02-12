import { schema } from '@healthcare/utils';
import { Button, Field } from '@healthcareos/react';
import { Form, Formik } from 'formik';
import Image from 'next/image';
import { object } from 'yup';

export default function Profile() {
  return (
    <div className="max-w-[360px]">
      <Formik
        validateOnMount
        validationSchema={object({
          first_name: schema.requireString('First name'),
          middle_name: schema.requireString('Middle name', false),
          last_name: schema.requireString('Last name'),
          email: schema.requireEmail('Email'),
          phone_number: schema.requirePhoneNumber('Phone number'),
        })}
        initialValues={{
          first_name: '',
          middle_name: '',
          last_name: '',
          email: '',
          phone_number: '',
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
          <Form>
            <div className="w-[120px] h-[120px] rounded-full overflow-hidden mb-6">
              <Image
                width={120}
                height={120}
                alt="profile"
                loading="lazy"
                src="https://via.placeholder.com/150"
                className="w-full h-full object-cover object-center"
              />
            </div>

            <div className="mb-10">
              <Field.Group name="first_name" label="First name">
                <Field.Input name="first_name" value={values.first_name} />
              </Field.Group>

              <Field.Group name="middle_name" label="Middle name(s)">
                <Field.Input name="middle_name" value={values.middle_name} />
              </Field.Group>

              <Field.Group name="last_name" label="Last name">
                <Field.Input name="last_name" value={values.last_name} />
              </Field.Group>

              <Field.Group name="email" label="Email">
                <Field.Input type="email" name="email" value={values.email} />
              </Field.Group>

              <Field.Group name="phone_number" label="Phone number">
                <Field.Phone
                  name="phone_number"
                  value={values.phone_number}
                  {...{ setFieldValue, setFieldTouched }}
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
              Save changes
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
