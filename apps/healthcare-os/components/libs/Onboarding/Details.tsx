import { Form, Formik, FormikHelpers } from 'formik';
import { Button, Field } from '@healthcareos/react';
import { schema } from '@healthcare/utils';
import { object } from 'yup';
import dayjs from 'dayjs';

type ValueProps = {
  first_name: string;
  middle_name: string;
  last_name: string;
  dob: string;
  ghanacard: string;
  gender: string;
  folder_number: string;
};

export interface DetailsProps {
  button?: string;
  params?: Partial<ValueProps>;
  onSubmit: (values: ValueProps, actions: FormikHelpers<ValueProps>) => void;
}

export function Details({ button, params = {}, onSubmit }: DetailsProps) {
  return (
    <div className="mx-auto max-w-[528px] w-full">
      <Formik
        validateOnMount
        enableReinitialize
        validationSchema={object({
          folder_number: schema.requireString('Folder number', false),
          first_name: schema.requireString('First name'),
          middle_name: schema.requireString('Middle name', false),
          last_name: schema.requireString('Last name'),
          dob: schema.requireString('Date of birth'),
          ghanacard: schema.requireGhanaCardNumber('Card number', false),
          gender: schema.requireString('Sex'),
        })}
        initialValues={{
          folder_number: params.folder_number || '',
          first_name: params.first_name || '',
          middle_name: params.middle_name || '',
          last_name: params.last_name || '',
          dob: params.dob || '',
          ghanacard: params.ghanacard || '',
          gender: params.gender || '',
        }}
        onSubmit={onSubmit}
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
            <h4 className="mb-4">Patient details</h4>

            <div className="mb-10">
              <Field.Group
                name="folder_number"
                label="Folder number / Patient ID"
              >
                <Field.Input
                  name="folder_number"
                  placeholder="Enter unique ID for patient"
                />
              </Field.Group>
              
              <Field.Group name="first_name" label="First name *">
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

              <Field.Group name="last_name" label="Last name *">
                <Field.Input
                  name="last_name"
                  value={values.last_name}
                  placeholder="Enter the last name of patient"
                />
              </Field.Group>

              <Field.Group name="dob" label="Date of birth *">
                <Field.Date
                  name="dob"
                  value={values.dob}
                  placeholder="01 -  jan - 2023"
                  options={{
                    dateFormat: 'd - M - Y',
                    maxDate: dayjs().toDate(),
                  }}
                  {...{ setFieldValue, setFieldTouched }}
                />
              </Field.Group>

              <Field.Group name="ghanacard" label="Ghana card number">
                <Field.ID
                  name="ghanacard"
                  value={values.ghanacard}
                  {...{ setFieldValue, setFieldTouched }}
                />
              </Field.Group>

              <div>
                <p className="mb-4">Sex *</p>
                <div className="flex gap-6">
                  <Field.Radio name="gender" value="male">
                    Male
                  </Field.Radio>
                  <Field.Radio name="gender" value="female">
                    Female
                  </Field.Radio>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={!isValid}
              className="w-full btn btn-primary"
              {...{ isSubmitting }}
            >
              {button}
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default Details;
