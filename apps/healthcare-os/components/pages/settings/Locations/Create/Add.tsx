import { Form, Formik, FieldArray } from 'formik';
import { DeleteIcon, PlusIcon } from '@healthcare/icons';
import { Button, Field } from '@healthcareos/react';
import { object } from 'yup';
import { schema } from '@healthcare/utils';

function Add() {
  return (
    <Formik
      validateOnMount
      validationSchema={object({
        name: schema.requireArray('Name').of(schema.requireString('Name')),
      })}
      initialValues={{
        name: [''],
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
            <p className="mb-6">
              Enter the name of the location you want to add and then click the
              Add another location button to add more.
            </p>

            <FieldArray
              name="name"
              render={(helpers) => (
                <>
                  <div>
                    <p className="text-sm mb-2">Name of location</p>
                    <div className="flex gap-2 flex-col mb-2">
                      {values.name.map((i, key) => (
                        <Field.Group
                          key={key}
                          name={`name.${key}`}
                          wrapperClassName="!mb-0"
                        >
                          <Field.Input
                            value={i}
                            name={`name.${key}`}
                            placeholder="Enter the name of the location"
                          />
                          {key !== 0 && (
                            <Button
                              type="button"
                              aria-label="Remove"
                              onClick={() => helpers.remove(key)}
                            >
                              <DeleteIcon />
                            </Button>
                          )}
                        </Field.Group>
                      ))}
                    </div>
                  </div>

                  <Button
                    type="button"
                    className="text-muted"
                    onClick={() => helpers.push('')}
                  >
                    <span>
                      <PlusIcon />
                    </span>
                    <span>Add another location</span>
                  </Button>
                </>
              )}
            />
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
              Add location
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}

export default Add;
