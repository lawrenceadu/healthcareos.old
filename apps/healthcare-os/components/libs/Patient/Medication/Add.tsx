import { FieldArray, Form, Formik } from 'formik';
import { AddIcon, DeleteIcon } from '@healthcare/icons';
import { Button, Field } from '@healthcareos/react';
import { schema } from '@healthcare/utils';
import { object } from 'yup';
import { toast } from 'react-toastify';

import Select from '../../Select';

function Add({
  onHide,
  setTab,
}: {
  onHide: () => void;
  setTab: (key: string) => void;
}) {
  /**
   * variables
   */
  const initialValues = {
    drug: '',
    dose: '',
    dose_unit: 'ml',
    times: '',
    times_unit: 'day',
    duration: '',
    duration_unit: 'week',
  };

  return (
    <Formik
      validateOnMount
      validationSchema={object({
        prescriptions: schema.requireArray('Prescriptions').of(
          object().shape({
            drug: schema.requireString('Drug'),
            dose: schema.requireNumber('Dose'),
            dose_unit: schema.requireString('Unit'),
            times: schema.requireNumber('Times'),
            times_unit: schema.requireString('Unit'),
            duration: schema.requireNumber('Duration'),
            duration_unit: schema.requireString('Unit'),
          })
        ),
        notes: schema.requireString('Notes', false),
      })}
      initialValues={{
        prescriptions: [initialValues],
        notes: '',
      }}
      onSubmit={() => {
        toast.success('Prescriptions added');
        setTab('index');
        return;
      }}
    >
      {({ values, isValid, isSubmitting, handleSubmit, setFieldValue }) => (
        <Form>
          <div className="px-6 mb-10">
            <FieldArray name="prescriptions">
              {(helper) => (
                <div className="mb-6">
                  <div className="grid gap-4 mb-4">
                    {values.prescriptions.map((pres, key) => (
                      <div
                        key={key}
                        className="grid gap-4 lg:grid-cols-[400px_repeat(3,minmax(0,1fr))_3rem]"
                      >
                        <Field.Group
                          label="Drug"
                          wrapperClassName="!mb-0"
                          name={`prescriptions.${key}.drug`}
                        >
                          <Field.Input
                            value={pres.drug}
                            name={`prescriptions.${key}.drug`}
                          />
                        </Field.Group>

                        <Field.Group
                          label="Dose"
                          wrapperClassName="!mb-0"
                          name={`prescriptions.${key}.dose`}
                        >
                          <Field.Input
                            name={`prescriptions.${key}.dose`}
                            value={pres.dose}
                          />
                          <Select
                            value={pres.dose_unit}
                            options={[{ label: 'ml', value: 'ml' }]}
                            onSelect={(value) =>
                              setFieldValue(
                                `prescriptions.${key}.dose_unit`,
                                value
                              )
                            }
                          />
                        </Field.Group>

                        <Field.Group
                          label="How many times?"
                          wrapperClassName="!mb-0"
                          name={`prescriptions.${key}.times`}
                        >
                          <Field.Input
                            value={pres.times}
                            name={`prescriptions.${key}.times`}
                          />

                          <Select
                            value={pres.times_unit}
                            options={[{ label: 'day', value: 'day' }]}
                            onSelect={(value) =>
                              setFieldValue(
                                `prescriptions.${key}.times_unit`,
                                value
                              )
                            }
                          />
                        </Field.Group>

                        <Field.Group
                          label="How long?"
                          wrapperClassName="!mb-0"
                          name={`prescriptions.${key}.duration`}
                        >
                          <Field.Input
                            value={pres.duration}
                            name={`prescriptions.${key}.duration`}
                          />

                          <Select
                            value={pres.duration_unit}
                            onSelect={(value) =>
                              setFieldValue(
                                `prescriptions.${key}.duration_unit`,
                                value
                              )
                            }
                            options={[
                              { label: 'day', value: 'day' },
                              { label: 'week', value: 'week' },
                            ]}
                          />
                        </Field.Group>

                        {key !== 0 && (
                          <div>
                            <Button
                              type="button"
                              onClick={() => helper.remove(key)}
                              className="text-red-600 mt-6 w-full !px-0"
                            >
                              <DeleteIcon />
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <Button
                    type="button"
                    className="btn btn-light"
                    onClick={() => helper.push(initialValues)}
                  >
                    <AddIcon />
                    <span>Add another prescription</span>
                  </Button>
                </div>
              )}
            </FieldArray>

            <Field.Group name="notes" label="Additional notes">
              <Field.Input
                as="textarea"
                className="py-4"
                value={values.notes}
              />
            </Field.Group>
          </div>

          <div className="flex gap-6 justify-end border-t border-gray-200 px-6 py-3">
            <Button
              type="button"
              className="btn-light"
              onClick={() => onHide()}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!isValid}
              className="btn btn-primary"
              onClick={() => handleSubmit()}
              {...{ isSubmitting }}
            >
              Add prescription
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}

export default Add;
