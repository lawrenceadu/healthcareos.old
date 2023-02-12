import { Button, Field, FileUpload } from '@healthcareos/react';
import { Form, Formik } from 'formik';
import { object } from 'yup';
import { schema } from '@healthcare/utils';

function Add() {
  return (
    <Formik
      validateOnMount
      validationSchema={object({
        role: schema.requireString('Role'),
        file: schema.requireFile({ field: 'File', type: ['csv'] }),
      })}
      initialValues={{
        role: '',
        file: {} as File,
      }}
      onSubmit={(params, { setSubmitting }) => {
        return;
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
        <Form className="">
          <div className="px-6 mb-6">
            <Field.Group name="role" label="Role">
              <Field.Select
                name="role"
                value={values.role}
                placeholder="Select role"
                options={[{ label: 'Doctor', value: 'doctor' }]}
                onChange={({ value }: { value: string }) =>
                  setFieldValue('role', value)
                }
              />
            </Field.Group>
            <Field.Group name="file" label="Upload csv file">
              <FileUpload
                name="file"
                accept=".csv"
                {...{ setFieldValue, setFieldTouched }}
              >
                {values?.file?.name}
              </FileUpload>
            </Field.Group>
          </div>

          <div className="flex gap-6 justify-end py-3 px-6 border-t border-gray-200">
            <Button type="button" className="text-muted">
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!isValid}
              className="btn btn-primary"
              onClick={() => handleSubmit()}
              {...{ isSubmitting }}
            >
              Upload file
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}

export default Add;
