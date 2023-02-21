import { useState } from 'react';
import { Button, Field, Modal } from '@healthcareos/react';
import { Form, Formik } from 'formik';
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
        header="Add investigation"
      >
        <div className="p-6">
          <Formik
            validateOnMount
            validationSchema={object({
              investigation: schema.requireString('Investigation'),
              result: schema.requireString('Result'),
              notes: schema.requireString('Notes'),
            })}
            initialValues={{
              investigation: '',
              result: '',
              notes: '',
            }}
            onSubmit={(params, { setSubmitting }) => {
              return;
            }}
          >
            {({ values, isValid, isSubmitting, handleSubmit }) => (
              <Form>
                <Field.Group name="investigation" label="Investigation title">
                  <Field.Input
                    name="investigation"
                    value={values.investigation}
                  />
                </Field.Group>

                <div className="mb-6">
                  <p className="mb-4">Results</p>
                  <div className="flex gap-6">
                    <Field.Radio name="result" value="negative">
                      Negative
                    </Field.Radio>
                    <Field.Radio name="result" value="positive">
                      Positive
                    </Field.Radio>
                    <Field.Radio name="result" value="inconclusive">
                      Inconclusive
                    </Field.Radio>
                  </div>
                </div>

                <Field.Group name="notes" label="Notes">
                  <Field.Input
                    as="textarea"
                    className="py-4"
                    name="notes"
                    value={values.notes}
                  />
                </Field.Group>

                <Button
                  type="submit"
                  disabled={!isValid}
                  onClick={() => handleSubmit()}
                  className="btn btn-primary w-full"
                  {...{ isSubmitting }}
                >
                  Add investigation
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
