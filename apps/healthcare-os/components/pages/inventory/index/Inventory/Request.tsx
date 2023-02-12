import React, { useState } from 'react';
import { Button, Field, Modal } from '@healthcareos/react';
import { Form, Formik } from 'formik';
import { object } from 'yup';

export interface RequestProps {
  children: (props: { proceed: () => void }) => void;
}

function Request({ children }: RequestProps) {
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
        header="Request inventory"
      >
        <Formik
          validateOnMount
          validationSchema={object({})}
          initialValues={{
            product: '',
            quantity: '',
            location: '',
            supplier: '',
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
            <Form>
              <div className="p-6">
                <Field.Group name="product" label="Product">
                  <Field.Select
                    name="product"
                    value={values.product}
                    options={[]}
                    placeholder="Select product"
                    onChange={({ value }: { value: string }) =>
                      setFieldValue('product', value)
                    }
                  />
                </Field.Group>

                <Field.Group name="quantity" label="Quantity">
                  <Field.Input
                    type="number"
                    name="quantity"
                    value={values.quantity}
                  />
                </Field.Group>

                <Field.Group name="location" label="Location">
                  <Field.Select
                    name="location"
                    value={values.location}
                    options={[]}
                    placeholder="Select location"
                    onChange={({ value }: { value: string }) =>
                      setFieldValue('location', value)
                    }
                  />
                </Field.Group>
              </div>

              <div className="flex gap-6 justify-end py-3 px-6 border-t border-gray-200">
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
                  Submit request
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </Modal>
    </>
  );
}

export default Request;
