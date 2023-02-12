import { schema } from '@healthcare/utils';
import { Button, Field } from '@healthcareos/react';
import { Form, Formik, FormikHelpers } from 'formik';
import { object, string } from 'yup';

type ValueProps = {
  phone_number_type: string;
  phone_number: string;
};

export interface ContactProps {
  button?: string;
  params?: Partial<ValueProps>;
  onSubmit: (values: ValueProps, actions: FormikHelpers<ValueProps>) => void;
}

export function Contact({ button, params = {}, onSubmit }: ContactProps) {
  return (
    <div className="mx-auto max-w-[528px] w-full">
      <Formik
        validateOnMount
        enableReinitialize
        validationSchema={object({
          phone_number_type: schema.requireString('Phone number type'),
          phone_number: string().when(
            'phone_number_type',
            (phone_number_type, sch) => {
              return schema.requirePhoneNumber(
                'Phone number',
                phone_number_type !== 'none',
                sch
              );
            }
          ),
        })}
        initialValues={{
          phone_number_type: params.phone_number_type || '',
          phone_number: params.phone_number || '',
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
            <h4 className="mb-4">Contact details</h4>

            <div className="mb-10">
              <div className="mb-6">
                <p className="mb-4">Type of phone</p>
                <div className="flex gap-6">
                  <Field.Radio name="phone_number_type" value="personal">
                    Personal
                  </Field.Radio>
                  <Field.Radio name="phone_number_type" value="shared">
                    Shared
                  </Field.Radio>
                  <Field.Radio name="phone_number_type" value="none">
                    No phone
                  </Field.Radio>
                </div>
              </div>

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

export default Contact;
