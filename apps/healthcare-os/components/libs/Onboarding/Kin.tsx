import { Form, Formik, FormikHelpers } from 'formik';
import { Button, Field } from '@healthcareos/react';
import { schema } from '@healthcare/utils';
import { object } from 'yup';

type ValueProps = {
  kin_fullname: string;
  kin_phone_number: string;
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
          kin_fullname: schema.requireFullName('Full name'),
          kin_phone_number: schema.requirePhoneNumber('Phone number'),
        })}
        initialValues={{
          kin_fullname: params.kin_fullname || '',
          kin_phone_number: params.kin_phone_number || '',
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
            <h4 className="mb-4">Next of kin / guardian</h4>

            <div className="mb-10">
              <Field.Group
                name="kin_fullname"
                label="Full name (first, middle, last)"
              >
                <Field.Input
                  name="kin_fullname"
                  value={values.kin_fullname}
                  placeholder="Enter full name"
                />
              </Field.Group>

              <Field.Group name="phone_number" label="Phone number">
                <Field.Phone
                  name="kin_phone_number"
                  value={values.kin_phone_number}
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

export default Kin;
