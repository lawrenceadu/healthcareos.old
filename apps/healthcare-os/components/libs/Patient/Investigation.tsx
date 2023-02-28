import { useState } from 'react';
import { FieldArray, Form, Formik } from 'formik';
import { Button, Field, Modal } from '@healthcareos/react';
import { DeleteIcon, PlusIcon } from '@healthcare/icons';
import { object } from 'yup';
import { schema } from '@healthcare/utils';
import { toast } from 'react-toastify';

export interface InvestigationProps {
  children: (props: { proceed: () => void }) => void;
}

export function Investigation({ children }: InvestigationProps) {
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
        header="Add investigation"
      >
        <Formik
          validateOnMount
          validationSchema={object({
            investigation: schema.requireString('Investigation'),
            results: schema.requireArray('Results').of(
              object().shape({
                label: schema.requireString('Label'),
                result: schema.requireString('Result'),
              })
            ),
            notes: schema.requireString('Notes'),
          })}
          initialValues={{
            investigation: '',
            results: [{ label: '', result: '' }],
            notes: '',
          }}
          onSubmit={(params, { setSubmitting }) => {
            toast.success('Investigation added');
            setShow(false);
          }}
        >
          {({ values, isValid, isSubmitting, handleSubmit }) => (
            <Form>
              <div className="p-6">
                <Field.Group name="investigation" label="Find investigation">
                  <Field.Input
                    name="investigation"
                    value={values.investigation}
                  />
                </Field.Group>

                <div className="mb-6">
                  <p className="mb-4 font-medium">Results</p>
                  <FieldArray name="results">
                    {(helper) => (
                      <div className="grid gap-4">
                        {values.results.map((i, key) => (
                          <div
                            key={key}
                            className="grid grid-cols-[repeat(2,minmax(0,1fr)),3rem] gap-6"
                          >
                            <Field.Group
                              label="Label"
                              wrapperClassName="!mb-0"
                              name={`results.${key}.label`}
                            >
                              <Field.Input
                                value={i.label}
                                name={`results.${key}.label`}
                              />
                            </Field.Group>

                            <Field.Group
                              label="Result"
                              wrapperClassName="!mb-0"
                              name={`results.${key}.result`}
                            >
                              <Field.Input
                                value={i.result}
                                name={`results.${key}.result`}
                              />
                            </Field.Group>
                            {key !== 0 && (
                              <Button
                                type="button"
                                className="text-red-600 mt-6"
                                onClick={() => helper.remove(key)}
                              >
                                <DeleteIcon />
                              </Button>
                            )}
                          </div>
                        ))}
                        <div>
                          <Button
                            type="button"
                            className="btn-light"
                            onClick={() =>
                              helper.push({ label: '', result: '' })
                            }
                          >
                            <PlusIcon />
                            <span>Add another</span>
                          </Button>
                        </div>
                      </div>
                    )}
                  </FieldArray>
                </div>

                <Field.Group name="notes" label="Notes">
                  <Field.Input
                    as="textarea"
                    className="py-4"
                    name="notes"
                    value={values.notes}
                  />
                </Field.Group>
              </div>

              <div className="px-6 py-3 border-t border-gray-200 flex gap-6 justify-end">
                <Button
                  type="button"
                  className="btn-light"
                  onClick={() => setShow(false)}
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
                  Add investigation
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </Modal>
    </>
  );
}

export default Investigation;
