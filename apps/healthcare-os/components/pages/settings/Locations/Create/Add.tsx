import { Form, Formik, FieldArray } from 'formik';
import { DeleteIcon, PlusIcon } from '@healthcare/icons';
import { Button, Field } from '@healthcareos/react';
import { object } from 'yup';
import { schema } from '@healthcare/utils';
import { toast } from 'react-toastify';

import { createLocationService } from '../../../../../services/settings';

export interface AddProps {
  onHide: () => void;
  mutate: () => void;
}

function Add({ onHide, mutate }: AddProps) {
  return (
    <Formik
      validateOnMount
      validationSchema={object({
        locations: schema.requireArray('location').of(
          object().shape({
            name: schema.requireString('Name'),
            type: schema.requireString('Type'),
          })
        ),
      })}
      initialValues={{
        locations: [{ name: '', type: '' }],
      }}
      onSubmit={({ locations }, { setSubmitting }) => {
        Promise.all(locations.map((i) => createLocationService(i)))
          .then(() => {
            toast.success('Location(s) added');
            onHide?.();
            mutate?.();
          })
          .catch(() => {
            toast.error('Unable to add location');
          })
          .finally(() => setSubmitting(false));
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
              name="locations"
              render={(helpers) => (
                <>
                  <div>
                    <div className="flex gap-2 flex-col mb-2">
                      {values.locations.map((i, key) => (
                        <div
                          key={key}
                          className="grid gap-4 md:grid-cols-[repeat(2,minmax(0,1fr))_3rem]"
                        >
                          <Field.Group
                            label="Name"
                            name={`locations.${key}.name`}
                            wrapperClassName="!mb-0"
                          >
                            <Field.Input
                              name={`locations.${key}.name`}
                              placeholder="Eg. Pharmacy Annex"
                            />
                          </Field.Group>

                          <Field.Group
                            label="Type"
                            name={`locations.${key}.type`}
                            wrapperClassName="!mb-0"
                          >
                            <Field.Input
                              name={`locations.${key}.type`}
                              placeholder="Eg. pharmacy"
                            />
                          </Field.Group>

                          {key !== 0 && (
                            <Button
                              type="button"
                              className="mt-6"
                              aria-label="Remove"
                              onClick={() => helpers.remove(key)}
                            >
                              <DeleteIcon />
                            </Button>
                          )}
                        </div>
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
            <Button
              type="button"
              onClick={() => onHide?.()}
              className="text-muted"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!isValid}
              className="btn btn-primary"
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
