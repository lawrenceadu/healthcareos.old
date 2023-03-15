import React, { useState } from 'react';
import { Button, Field, Modal } from '@healthcareos/react';
import { Form, Formik } from 'formik';
import { object } from 'yup';

export interface MoveProps {
  location?: string;
  children: (props: { proceed: () => void }) => void;
}

function Move({ children, location }: MoveProps) {
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
        header="Move Folic acid 5mg tablet"
      >
        <Formik
          validateOnMount
          validationSchema={object({})}
          initialValues={{
            expiry_date: '2023-02-27',
            available_quantity: '1200',
            quantity_to_move: '',
            location: location || '',
            move_to: '',
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

                <div className="grid gap-6 mb-6 md:grid-cols-2">
                  <Field.Group
                    disabled
                    label="Quantity"
                    wrapperClassName="!mb-0"
                    name="available_quantity"
                  >
                    <Field.Input
                      type="number"
                      name="available_quantity"
                      value={values.available_quantity}
                    />
                  </Field.Group>

                  <Field.Group
                    disabled
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

                <Field.Group name="quantity_to_move" label="Quantity to move">
                  <Field.Input
                    type="number"
                    name="quantity_to_move"
                    value={values.quantity_to_move}
                  />
                </Field.Group>

                <Field.Group
                  name="move_to"
                  label="Move to"
                  containerClassName="!h-auto"
                >
                  <Field.Select
                    name="move_to"
                    value={values.move_to}
                    placeholder="Select location"
                    options={[
                      { label: 'Consulting room', value: 'consulting' },
                    ]}
                    onChange={({ value }: { value: string }) =>
                      setFieldValue('move_to', value)
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

export default Move;
