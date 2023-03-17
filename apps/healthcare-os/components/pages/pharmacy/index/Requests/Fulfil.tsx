import { ReactElement, useState } from 'react';
import { Form, Formik } from 'formik';
import { object } from 'yup';
import { Button, Field, Modal } from '@healthcareos/react';

export interface FulfilProps {
  request: any;
  children: ({ proceed }: { proceed: () => void }) => ReactElement;
}

export default function Fulfil({ request, children }: FulfilProps) {
  /**
   * state
   */
  const [state, setState] = useState(false);

  return (
    <>
      {children({ proceed: () => setState(true) })}

      <Modal
        show={state}
        header="Fulfil request"
        onHide={() => setState(false)}
      >
        <Formik
          validateOnMount
          validationSchema={object({})}
          initialValues={{
            receiving_location: 'Consulting room',
            requested_quantity: 600,
            sending_location: '',
            final_quantity: '',
          }}
          onSubmit={() => {
            return;
          }}
        >
          {({ values, isValid, isSubmitting, handleSubmit, setFieldValue }) => (
            <Form>
              <div className="p-6">
                <Field.Group
                  disabled
                  name="receiving_location"
                  label="Receiving location"
                >
                  <Field.Input
                    name="receiving_location"
                    value={values.receiving_location}
                  />
                </Field.Group>
                <Field.Group
                  disabled
                  name="requested_quantity"
                  label="Requested quantity"
                >
                  <Field.Input
                    name="requested_quantity"
                    value={values.requested_quantity}
                  />
                </Field.Group>

                <Field.Group
                  name="sending_location"
                  label="Select location to send from"
                >
                  <Field.Select
                    placeholder="Select location"
                    value={values.sending_location}
                    options={[{ label: 'Pharmacy', value: 'pharmacy' }]}
                    onChange={({ value }: { value: string }) =>
                      setFieldValue('sending_location', value)
                    }
                  />
                </Field.Group>

                <Field.Group name="final_quantity" label="Quantity to move">
                  <Field.Input
                    type="number"
                    name="final_quantity"
                    value={values.final_quantity}
                    placeholder="1"
                  />
                </Field.Group>
              </div>

              <div className="py-3 px-6 border-t border-gray-200 flex justify-end gap-6">
                <Button
                  type="button"
                  className="text-muted"
                  onClick={() => setState(false)}
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
                  Fulfil request
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </Modal>
    </>
  );
}
