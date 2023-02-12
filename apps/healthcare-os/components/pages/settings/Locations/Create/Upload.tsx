import { Button, Field, FileUpload } from '@healthcareos/react';
import { Form, Formik } from 'formik';
import { object } from 'yup';
import { schema } from '@healthcare/utils';

function Add() {
  return (
    <Formik
      validateOnMount
      validationSchema={object({
        file: schema.requireFile({ field: 'File', type: ['csv'] }),
      })}
      initialValues={{
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
          <Field.Group
            name="file"
            label="Upload csv file"
            wrapperClassName="px-6 mb-6"
          >
            <FileUpload
              name="file"
              accept=".csv"
              {...{ setFieldValue, setFieldTouched }}
            >
              {values?.file?.name}
            </FileUpload>
          </Field.Group>

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
