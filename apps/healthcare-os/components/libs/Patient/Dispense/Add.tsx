import { useState } from 'react';
import { FieldArray, Form, Formik } from 'formik';
import { Button, Field, Modal } from '@healthcareos/react';
import { AddIcon, DeleteIcon } from '@healthcare/icons';
import { object } from 'yup';
import { schema } from '@healthcare/utils';

export interface AddProps {
  children: (props: { proceed: () => void }) => void;
}

export function Add({ children }: AddProps) {
  /**
   * state
   */
  const [state, setState] = useState(false);

  return (
    <>
      {children({ proceed: () => setState(true) })}

      <Modal
        show={state}
        onHide={() => setState(false)}
        header="Add prescription"
      >
        <div className="p-6">
          <Formik
            validateOnMount
            validationSchema={object({
              drug: schema.requireString('Drug'),
              dose: schema.requireNumber('Dose'),
              dose_unit: schema.requireString('Unit'),
              times: schema.requireNumber('Times'),
              times_unit: schema.requireString('Unit'),
              duration: schema.requireNumber('Duration'),
              duration_unit: schema.requireString('Unit'),
              notes: schema.requireString('Notes'),
            })}
            initialValues={{
              drug: '',
              dose: '',
              dose_unit: 'ml',
              times: '',
              times_unit: 'day',
              duration: '',
              duration_unit: 'week',
              notes: '',
            }}
            onSubmit={() => {
              return;
            }}
          >
            {({
              values,
              isValid,
              isSubmitting,
              handleSubmit,
              setFieldValue,
            }) => (
              <Form>
                <Field.Group name="drug" label="Drug">
                  <Field.Input name="drug" value={values.drug} />
                </Field.Group>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <Field.Group name="dose" label="Dose" wrapperClassName="mb-0">
                    <Field.Input name="dose" value={values.dose} />
                  </Field.Group>
                  <Field.Group
                    name="dose_unit"
                    label="Unit"
                    wrapperClassName="mb-0"
                  >
                    <Field.Select
                      isSearchable={false}
                      name="dose_unit"
                      value={values.dose_unit}
                      options={[{ label: 'ml', value: 'ml' }]}
                      onChange={({ value }: { value: string }) =>
                        setFieldValue('dose_unit', value)
                      }
                    />
                  </Field.Group>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <Field.Group
                    name="times"
                    label="How many times?"
                    wrapperClassName="mb-0"
                  >
                    <Field.Input name="times" value={values.times} />
                  </Field.Group>
                  <Field.Group
                    label="Per"
                    name="times_unit"
                    wrapperClassName="mb-0"
                  >
                    <Field.Select
                      isSearchable={false}
                      name="times_unit"
                      value={values.times_unit}
                      options={[{ label: 'day', value: 'day' }]}
                      onChange={({ value }: { value: string }) =>
                        setFieldValue('times_unit', value)
                      }
                    />
                  </Field.Group>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <Field.Group
                    name="duration"
                    label="How long?"
                    wrapperClassName="mb-0"
                  >
                    <Field.Input name="duration" value={values.duration} />
                  </Field.Group>
                  <Field.Group
                    label="For"
                    name="duration_unit"
                    wrapperClassName="mb-0"
                  >
                    <Field.Select
                      isSearchable={false}
                      name="duration_unit"
                      value={values.duration_unit}
                      options={[
                        { label: 'day', value: 'day' },
                        { label: 'week', value: 'week' },
                      ]}
                      onChange={({ value }: { value: string }) =>
                        setFieldValue('duration_unit', value)
                      }
                    />
                  </Field.Group>
                </div>

                <Field.Group name="notes" label="Additional notes">
                  <Field.Input
                    as="textarea"
                    className="py-4"
                    value={values.notes}
                  />
                </Field.Group>

                <Button
                  type="submit"
                  disabled={!isValid}
                  className="btn btn-primary w-full"
                  onClick={() => handleSubmit()}
                  {...{ isSubmitting }}
                >
                  Add prescription
                </Button>
              </Form>
            )}
          </Formik>
        </div>
      </Modal>
    </>
  );
}

export default Add;
