import { Button, Field } from '@healthcareos/react';
import { Form, Formik } from 'formik';
import { SearchIcon } from '@healthcare/icons';
import { useRouter } from 'next/router';
import { schema } from '@healthcare/utils';
import { object } from 'yup';

import routes from '../../../../routes';

export function FindPatient() {
  /**
   * routes
   */
  const router = useRouter();

  /**
   * functions
   */
  const isValid = (values: object): boolean => {
    let isValid = false;

    Object.keys(values).map((key) => {
      if (values[key]) {
        isValid = true;
      }
    });

    return isValid;
  };

  return (
    <div className="mx-auto md:max-w-[480px] max-w-[528px] w-full pb-12">
      <Formik
        validateOnMount
        validationSchema={object({
          first_name: schema.requireString('First name', false),
          last_name: schema.requireString('Last name', false),
          middle_name: schema.requireString('Middle name', false),
          date_of_birth: schema.requireString('Date of birth', false),
          phone_number: schema.requirePhoneNumber('Phone number', false),
          id_number: schema.requireString('ID Number', false),
        })}
        initialValues={{
          first_name: '',
          middle_name: '',
          last_name: '',
          date_of_birth: '',
          phone_number: '',
          id_number: '',
        }}
        onSubmit={(params, { setSubmitting }) => {
          const data = {};

          Object.keys(params).map((key) => {
            if (params[key]) {
              data[key] = params[key];
            }
          });

          router.push({
            pathname: routes.dashboard.patients.search,
            query: data,
          });
        }}
      >
        {({
          values,
          handleSubmit,
          isSubmitting,
          setFieldValue,
          setFieldTouched,
        }) => (
          <Form>
            <div className="mb-10">
              <Field.Group name="first_name" label="First name">
                <Field.Input
                  name="first_name"
                  value={values.first_name}
                  placeholder="Enter the first name of patient"
                />
              </Field.Group>

              <Field.Group name="middle_name" label="Middle name">
                <Field.Input
                  name="middle_name"
                  value={values.middle_name}
                  placeholder="Enter the middle name(s) of patient"
                />
              </Field.Group>

              <Field.Group name="last_name" label="Last name">
                <Field.Input
                  name="last_name"
                  value={values.last_name}
                  placeholder="Enter the last name of patient"
                />
              </Field.Group>

              <Field.Group name="date_of_birth" label="Date of birth">
                <Field.Date
                  name="date_of_birth"
                  value={values.date_of_birth}
                  options={{
                    dateFormat: 'd - M - Y',
                  }}
                  {...{ setFieldValue, setFieldTouched }}
                />
              </Field.Group>

              <Field.Group name="phone_number" label="Phone number">
                <Field.Phone
                  name="phone_number"
                  value={values.phone_number}
                  {...{ setFieldValue, setFieldTouched }}
                />
              </Field.Group>

              <Field.Group name="id_number" label="Ghana card number">
                <Field.ID
                  name="id_number"
                  value={values.id_number}
                  {...{ setFieldValue, setFieldTouched }}
                />
              </Field.Group>
            </div>

            <Button
              type="submit"
              disabled={!isValid(values)}
              className="btn btn-primary w-full"
              {...{ isSubmitting }}
            >
              <span>
                <SearchIcon />
              </span>
              <span>Find patient</span>
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default FindPatient;
