import { useState } from 'react';
import { FieldArray, Form, Formik } from 'formik';
import { Button, Field, Modal } from '@healthcareos/react';
import { AddIcon, DeleteIcon } from '@healthcare/icons';
import { object } from 'yup';
import { schema } from '@healthcare/utils';

export interface DetainProps {
  children: (props: { proceed: () => void }) => void;
}

function Detain({ children }: DetainProps) {
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
        header="Detain patient"
      >
        <Formik
          validateOnMount
          validationSchema={object({
            diagnosis: schema
              .requireArray('Diagnosis')
              .of(schema.requireString('Diagnosis')),
            ward: schema.requireString('Ward'),
            department: schema.requireString('Department'),
            notes: schema.requireString('Notes'),
          })}
          initialValues={{
            diagnosis: [''] as string[],
            ward: '',
            department: '',
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
            setFieldTouched,
          }) => (
            <Form className="p-6">
              <div className="mb-6">
                <p className="text-sm mb-1">Diagnosis</p>

                <FieldArray name="diagnosis">
                  {(helpers) => (
                    <>
                      <div className="flex flex-col gap-4 mb-4">
                        {values.diagnosis.map((diagnosis, key) => (
                          <Field.Group
                            key={key}
                            name={`diagnosis.${key}`}
                            wrapperClassName="!mb-0"
                          >
                            <Field.Input
                              value={diagnosis}
                              name={`diagnosis.${key}`}
                            />
                            {key !== 0 && (
                              <Button
                                type="button"
                                className="!py-0"
                                aria-label="Remove"
                                onClick={() => helpers.remove(key)}
                              >
                                <DeleteIcon />
                              </Button>
                            )}
                          </Field.Group>
                        ))}
                      </div>
                      <Button
                        type="button"
                        className="btn-light"
                        onClick={() => helpers.push('')}
                      >
                        <AddIcon />
                        <span>Add diagnosis</span>
                      </Button>
                    </>
                  )}
                </FieldArray>
              </div>

              <Field.Group name="ward" label="Ward">
                <Field.Select
                  name="ward"
                  options={[]}
                  placeholder="Select ward"
                  value={values.ward}
                  onChange={({ value }: { value: string }) =>
                    setFieldValue('ward', value)
                  }
                />
              </Field.Group>

              <Field.Group name="department" label="Department">
                <Field.Select
                  name="department"
                  options={[]}
                  placeholder="Select department"
                  value={values.department}
                  onChange={({ value }: { value: string }) =>
                    setFieldValue('department', value)
                  }
                />
              </Field.Group>

              <Field.Group name="notes" label="Detention notes">
                <Field.Input
                  name="notes"
                  as="textarea"
                  className="py-4"
                  value={values.notes}
                  placeholder="Type notes here..."
                />
              </Field.Group>

              <Button
                type="submit"
                disabled={!isValid}
                onClick={() => handleSubmit()}
                className="btn btn-primary w-full"
                {...{ isSubmitting }}
              >
                Detain patient
              </Button>
            </Form>
          )}
        </Formik>
      </Modal>
    </>
  );
}

export default Detain;
