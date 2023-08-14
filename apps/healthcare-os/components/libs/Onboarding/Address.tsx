import { useState } from 'react';
import { Form, Formik, FormikHelpers } from 'formik';
import { Button, Field } from '@healthcareos/react';
import { schema } from '@healthcare/utils';
import { object } from 'yup';

import { useDistricts, useRegions } from '../../../hooks';

type ValueProps = {
  region: string;
  district: string;
  city: string;
  address: string;
};

export interface AddressProps {
  button?: string;
  params?: Partial<ValueProps>;
  onSubmit: (values: ValueProps, actions: FormikHelpers<ValueProps>) => void;
}

export function Address({ button, params = {}, onSubmit }: AddressProps) {
  /**
   * state
   */
  const [regionId, setRegionId] = useState<string>(params?.region);

  /**
   * hooks
   */
  const regions = useRegions();
  const districts = useDistricts(regionId);

  return (
    <div className="mx-auto max-w-[528px] w-full">
      <Formik
        validateOnMount
        enableReinitialize
        validationSchema={object({
          region: schema.requireString('Region'),
          district: schema.requireString('District'),
          city: schema.requireString('City'),
          address: schema.requireString('Street'),
        })}
        initialValues={{
          region: params.region || '',
          district: params.district || '',
          city: params.city || '',
          address: params.address || '',
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
                  options={regions?.map((i) => ({
                    label: i.name,
                    value: i.id,
                  }))}
                  onChange={({ value }: { value }) => {
                    setFieldValue('region', value);
                    setFieldValue('district', '');
                    setRegionId(value);
                  }}
                />
              </Field.Group>

              <Field.Group name="district" label="District">
                <Field.Select
                  name="district"
                  value={values.district}
                  placeholder="Select district"
                  options={districts?.map((i) => ({
                    label: i.name,
                    value: i.id,
                  }))}
                  onChange={({ value }: { value }) =>
                    setFieldValue('district', value)
                  }
                />
              </Field.Group>

              <Field.Group name="city" label="City">
                <Field.Input
                  name="city"
                  value={values.city}
                  placeholder="Select city"
                />
              </Field.Group>

              <Field.Group name="address" label="Street/Landmark">
                <Field.Input name="address" value={values.address} />
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

export default Address;
