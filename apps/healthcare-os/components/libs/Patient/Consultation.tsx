import { useState } from 'react';
import { FieldArray, Form, Formik } from 'formik';
import { Button, Field, Modal } from '@healthcareos/react';
import { AddIcon, DeleteIcon } from '@healthcare/icons';
import { schema } from '@healthcare/utils';
import { object } from 'yup';
import { toast } from 'react-toastify';

export interface ConsultationProps {
  children: (props: { proceed: () => void }) => void;
}

export function Consultation({ children }: ConsultationProps) {
  /**
   * state
   */
  const [show, setShow] = useState(false);

  return (
    <>
      {children({ proceed: () => setShow(true) })}

      <Modal
        show={show}
        onHide={() => setShow(false)}
        header="Add consultation"
      >
        <Formik
          validateOnMount
          validationSchema={object({
            history: schema.requireString('History and examination'),
            diagnosis: schema
              .requireArray('Diagnosis')
              .of(schema.requireString('Diagnosis')),
            plan: schema.requireString('Plan'),
          })}
          initialValues={{
            plan: '',
            history: '',
            diagnosis: [''] as string[],
          }}
          onSubmit={() => {
            toast.success('Consultation added');
            setShow(false);
          }}
        >
          {({ values, isValid, isSubmitting, handleSubmit }) => (
            <Form>
              <div className="p-6">
                <Field.Group name="history" label="History and Examination">
                  <Field.Input
                    as="textarea"
                    name="history"
                    className="py-4"
                    value={values.history}
                  />
                </Field.Group>

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
                          <span>Add another diagnosis</span>
                        </Button>
                      </>
                    )}
                  </FieldArray>
                </div>

                <Field.Group name="plan" label="Plan">
                  <Field.Input
                    as="textarea"
                    name="plan"
                    className="py-4"
                    value={values.plan}
                  />
                </Field.Group>
              </div>

              <div className="px-6 py-3 flex gap-6 justify-end border-t border-gray-200">
                <Button className="btn-light" onClick={() => setShow(false)}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={!isValid}
                  className="btn btn-primary"
                  onClick={() => handleSubmit()}
                  {...{ isSubmitting }}
                >
                  Add consultation
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </Modal>
    </>
  );
}

export default Consultation;
