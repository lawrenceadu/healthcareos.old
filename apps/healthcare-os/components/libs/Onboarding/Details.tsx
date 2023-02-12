import { Form, Formik, FormikHelpers } from 'formik';
import { Button, Field } from '@healthcareos/react';
import { schema } from '@healthcare/utils';
import { object } from 'yup';

type ValueProps = {
  patient_type: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  date_of_birth: string;
  ghana_card_number: string;
  sex: string;
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
          patient_type: schema.requireString('Type'),
          first_name: schema.requireString('First name'),
          middle_name: schema.requireString('Middle name', false),
          last_name: schema.requireString('Last name'),
          date_of_birth: schema.requireString('Date of birth'),
          ghana_card_number: schema.requireGhanaCardNumber(
            'Card number',
            false
          ),
          sex: schema.requireString('Sex'),
        })}
        initialValues={{
          patient_type: params.patient_type || '',
          first_name: params.first_name || '',
          middle_name: params.middle_name || '',
          last_name: params.last_name || '',
          date_of_birth: params.date_of_birth || '',
          ghana_card_number: params.ghana_card_number || '',
          sex: params.sex || '',
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
              <div className="mb-6">
                <p className="mb-4">What type of patient is this patient?</p>
                <div className="flex gap-6">
                  <Field.Radio name="patient_type" value="outpatient">
                    Outpatient
                  </Field.Radio>
                  <Field.Radio name="patient_type" value="inpatient">
                    Inpatient
                  </Field.Radio>
                </div>
              </div>

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
                  placeholder="01 -  jan - 2023"
                  options={{
                    dateFormat: 'd - M - Y',
                  }}
                  {...{ setFieldValue, setFieldTouched }}
                />
              </Field.Group>

              <Field.Group name="ghana_card_number" label="Ghana card number">
                <Field.ID
                  name="ghana_card_number"
                  value={values.ghana_card_number}
                  {...{ setFieldValue, setFieldTouched }}
                />
              </Field.Group>

              <div>
                <p className="mb-4">Sex</p>
                <div className="flex gap-6">
                  <Field.Radio name="sex" value="male">
                    Male
                  </Field.Radio>
                  <Field.Radio name="sex" value="female">
                    Female
                  </Field.Radio>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={!isValid}
              onClick={() => handleSubmit()}
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
