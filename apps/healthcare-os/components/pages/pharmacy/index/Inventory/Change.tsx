import React, { useState } from 'react';
import { Button, Field, Modal } from '@healthcareos/react';
import { Form, Formik } from 'formik';
import { object } from 'yup';

export interface ChangeProps {
  location?: string;
  children: (props: { proceed: () => void }) => void;
}

function Change({ children, location }: ChangeProps) {
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
        header="Change Folic acid 5mg tablet"
      >
        <Formik
          validateOnMount
          validationSchema={object({})}
          initialValues={{
            type: '',
            reason: '',
            quantity: '',
            expiry_date: '',
            location: location || '',
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
                <Field.Group
                  disabled={!!location}
                  name="location"
                  label="Location"
                >
                  <Field.Select
                    name="location"
                    isDisabled={!!location}
                    value={values.location}
                    options={[
                      { label: 'Consulting room', value: 'consulting' },
                    ]}
                    placeholder="Select location"
                    onChange={({ value }: { value: string }) =>
                      setFieldValue('location', value)
                    }
                  />
                </Field.Group>

                <div className="md:grid gap-6 mb-6 grid-cols-2">
                  <Field.Group
                    name="quantity"
                    label="Quantity"
                    wrapperClassName="!mb-0"
                  >
                    <Field.Input
                      type="number"
                      name="quantity"
                      value={values.quantity}
                    />
                  </Field.Group>

                  <Field.Group
                    name="expiry_date"
                    label="Expiry date"
                    wrapperClassName="!mb-0"
                  >
                    <Field.Date
                      name="expiry_date"
                      value={values.expiry_date}
                      {...{ setFieldValue, setFieldTouched }}
                    />
                  </Field.Group>
                </div>

                <Field.Group name="type" label="Type of change">
                  <Field.Select
                    name="type"
                    value={values.type}
                    options={[]}
                    placeholder="Select type"
                    onChange={({ value }: { value: string }) =>
                      setFieldValue('type', value)
                    }
                  />
                </Field.Group>

                <Field.Group
                  name="reason"
                  label="Reason for change"
                  containerClassName="!h-auto"
                >
                  <Field.Input
                    as="textarea"
                    name="reason"
                    rows={3}
                    className="py-3"
                    value={values.reason}
                    placeholder="Type the reason you are changing this product here..."
                    onChange={({ value }: { value: string }) =>
                      setFieldValue('reason', value)
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
                  Change
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </Modal>
    </>
  );
}

export default Change;
