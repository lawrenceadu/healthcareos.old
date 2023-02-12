import { Form, Formik, FormikHelpers } from 'formik';
import { object } from 'yup';
import { Button, Field } from '@healthcareos/react';
import { schema } from '@healthcare/utils';

type ValueProps = {
  nationality: string;
  language: string;
  marital_status: string;
};

export interface AdditionalInfoProps {
  button?: string;
  params?: Partial<ValueProps>;
  onSubmit: (values: ValueProps, actions: FormikHelpers<ValueProps>) => void;
}

export function AdditionalInfo({
  button,
  params = {},
  onSubmit,
}: AdditionalInfoProps) {
  return (
    <div className="mx-auto max-w-[528px] w-full">
      <Formik
        validateOnMount
        enableReinitialize
        validationSchema={object({
          nationality: schema.requireString('Nationality'),
          language: schema.requireString('Language'),
          marital_status: schema.requireString('Marital status'),
        })}
        initialValues={{
          nationality: params.nationality || '',
          language: params.language || '',
          marital_status: params.marital_status || '',
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
            <h4 className="mb-4">Additional information</h4>

            <div className="mb-10">
              <Field.Group name="nationality" label="Nationality">
                <Field.Select
                  name="nationality"
                  value={values.nationality}
                  placeholder="Select nationality"
                  options={[{ label: 'Ghanaian', value: 'ghanaian' }]}
                  onChange={({ value }: { value: string }) =>
                    setFieldValue('nationality', value)
                  }
                />
              </Field.Group>
              <Field.Group name="language" label="Language">
                <Field.Select
                  name="language"
                  value={values.language}
                  placeholder="Select language"
                  options={[{ label: 'English', value: 'english' }]}
                  onChange={({ value }: { value: string }) =>
                    setFieldValue('language', value)
                  }
                />
              </Field.Group>
              <Field.Group name="marital_status" label="Marital status">
                <Field.Select
                  name="marital_status"
                  value={values.marital_status}
                  placeholder="Select marital status"
                  options={[{ label: 'Single', value: 'single' }]}
                  onChange={({ value }: { value: string }) =>
                    setFieldValue('marital_status', value)
                  }
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

export default AdditionalInfo;
