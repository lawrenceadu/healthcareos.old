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

      <Modal show={state} onHide={() => setState(false)} header="Add allergy">
        <div className="p-6">
          <Formik
            validateOnMount
            validationSchema={object({
              substance: schema.requireString('Substance'),
              severity: schema.requireString('Result'),
              symptoms: schema.requireString('Symptoms'),
              notes: schema.requireString('Notes'),
            })}
            initialValues={{
              substance: '',
              severity: '',
              symptoms: '',
              notes: '',
            }}
            onSubmit={(params, { setSubmitting }) => {
              return;
            }}
          >
            {({ values, isValid, isSubmitting, handleSubmit }) => (
              <Form>
                <Field.Group name="substance" label="Substance">
                  <Field.Input name="substance" value={values.substance} />
                </Field.Group>

                <div className="mb-6">
                  <p className="mb-4">Severity of reaction</p>
                  <div className="flex gap-6">
                    <Field.Radio name="severity" value="mild">
                      Mild
                    </Field.Radio>
                    <Field.Radio name="severity" value="moderate">
                      Moderate
                    </Field.Radio>
                    <Field.Radio name="severity" value="severe">
                      Severe
                    </Field.Radio>
                  </div>
                </div>

                <Field.Group name="symptoms" label="Symptoms">
                  <Field.Input name="symptoms" value={values.symptoms} />
                </Field.Group>

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
                  Add allergy
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
