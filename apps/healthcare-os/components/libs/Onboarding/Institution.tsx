import { Formik, Form, FormikHelpers } from 'formik';
import { Button, Field } from '@healthcareos/react';
import { schema } from '@healthcare/utils';
import { object } from 'yup';

import { useInstitutions } from '../../../hooks';

type ValueProps = {
  institution: string;
};

export interface InstitutionProps {
  button?: string;
  params?: Partial<ValueProps>;
  onSubmit: (values: ValueProps, actions: FormikHelpers<ValueProps>) => void;
}

function Institution({ button, params, onSubmit }: InstitutionProps) {
  /**
   * hooks
   */
  const institutions =
    useInstitutions()?.map((i) => ({ label: i.name, value: i.id })) || [];

  return (
    <div className="mx-auto max-w-[528px] w-full">
      <Formik
        validateOnMount
        enableReinitialize
        validationSchema={object({
          institution: schema.requireString('Institution', false),
        })}
        initialValues={{
          institution: params?.institution || '',
        }}
        onSubmit={onSubmit}
      >
        {({ values, isValid, isSubmitting, setFieldValue }) => (
          <Form>
            <h4 className="mb-4">Institution</h4>

            <div className="mb-10">
              <Field.Group name="institution" label="Institution">
                <Field.Select
                  options={institutions}
                  value={values.institution}
                  onChange={({ value }) => setFieldValue('institution', value)}
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

export default Institution;
