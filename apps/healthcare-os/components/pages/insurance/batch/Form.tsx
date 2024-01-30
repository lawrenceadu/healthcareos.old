import { schema } from '@healthcare/utils';
import { Button, Field } from '@healthcareos/react';
import { Form as FormikForm, Formik, FormikHelpers } from 'formik';
import { object } from 'yup';

type ValueProps = {
  title: string;
};

export interface FormProps {
  params?: ValueProps;
  onSubmit: (values: ValueProps, actions: FormikHelpers<ValueProps>) => void;
}

function Form({ params, onSubmit }: FormProps) {
  return (
    <Formik
      validateOnMount
      enableReinitialize
      validationSchema={object({
        title: schema.requireString('Title'),
      })}
      initialValues={{ title: params?.title || '' }}
      onSubmit={onSubmit}
    >
      {({ isValid, isSubmitting }) => (
        <FormikForm>
          <Field.Group name="title" label="Title">
            <Field.Input name="title" placeholder="January-2024" />
          </Field.Group>
          <Button
            type="submit"
            disabled={!isValid}
            className="w-full btn btn-primary"
            {...{ isSubmitting }}
          >
            Submit
          </Button>
        </FormikForm>
      )}
    </Formik>
  );
}

export default Form;
