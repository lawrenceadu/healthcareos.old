import { schema } from '@healthcare/utils';
import { Button, Field } from '@healthcareos/react';
import { Form, Formik, FormikHelpers } from 'formik';
import { object } from 'yup';

type ValueProps = {
  region: string;
  district: string;
  city: string;
  street: string;
};

export interface AddressProps {
  button?: string;
  params?: Partial<ValueProps>;
  onSubmit: (values: ValueProps, actions: FormikHelpers<ValueProps>) => void;
}

export function Address({ button, params = {}, onSubmit }: AddressProps) {
  return (
    <div className="mx-auto max-w-[528px] w-full">
      <Formik
        validateOnMount
        enableReinitialize
        validationSchema={object({
          region: schema.requireString('Region'),
          district: schema.requireString('District'),
          city: schema.requireString('City'),
          street: schema.requireString('Street'),
        })}
        initialValues={{
          region: params.region || '',
          district: params.district || '',
          city: params.city || '',
          street: params.street || '',
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
            <h4 className="mb-4">Address</h4>

            <div className="mb-10">
              <Field.Group name="region" label="Region">
                <Field.Select
                  name="region"
                  value={values.region}
                  placeholder="Select region"
                  options={[
                    { label: 'Greater Accra', value: 'greater_accres' },
                  ]}
                  onChange={({ value }: { value }) =>
                    setFieldValue('region', value)
                  }
                />
              </Field.Group>

              <Field.Group name="district" label="District">
                <Field.Select
                  name="district"
                  value={values.district}
                  placeholder="Select district"
                  options={[{ label: 'East La', value: 'east_la' }]}
                  onChange={({ value }: { value }) =>
                    setFieldValue('district', value)
                  }
                />
              </Field.Group>

              <Field.Group name="city" label="City">
                <Field.Select
                  name="city"
                  value={values.city}
                  placeholder="Select city"
                  options={[{ label: 'Tseaddo', value: 'tseaddo' }]}
                  onChange={({ value }: { value }) =>
                    setFieldValue('city', value)
                  }
                />
              </Field.Group>

              <Field.Group name="street" label="Street/Landmark">
                <Field.Input name="street" value={values.street} />
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

export default Address;
