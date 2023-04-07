import { Form, Formik, FormikHelpers } from 'formik';
import { Button, Field } from '@healthcareos/react';
import { schema } from '@healthcare/utils';
import { object } from 'yup';

type ValueProps = {
  next_of_kin_name: string;
  next_of_kin_phone: string;
};

export interface KinProps {
  button?: string;
  params?: Partial<ValueProps>;
  onSubmit: (values: ValueProps, actions: FormikHelpers<ValueProps>) => void;
}

export function Kin({ button, params = {}, onSubmit }: KinProps) {
  return (
    <div className="mx-auto max-w-[528px] w-full">
      <Formik
        validateOnMount
        validationSchema={object({
          next_of_kin_name: schema.requireFullName('Full name', false),
          next_of_kin_phone: schema.requirePhoneNumber('Phone number', false),
        })}
        initialValues={{
          next_of_kin_name: params.next_of_kin_name || '',
          next_of_kin_phone: params.next_of_kin_phone || '',
        }}
        onSubmit={(params, actions) => {
          actions.setSubmitting(true);
          return onSubmit(params, actions);
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
            <h4 className="mb-4">Next of kin / guardian</h4>

            <div className="mb-10">
              <Field.Group
                name="next_of_kin_name"
                label="Full name (first, middle, last)"
              >
                <Field.Input
                  name="next_of_kin_name"
                  value={values.next_of_kin_name}
                  placeholder="Enter full name"
                />
              </Field.Group>

              <Field.Group name="phone_number" label="Phone number">
                <Field.Phone
                  name="next_of_kin_phone"
                  value={values.next_of_kin_phone}
                  {...{ setFieldValue, setFieldTouched }}
                />
              </Field.Group>
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

export default Kin;
