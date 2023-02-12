import React, { useState } from 'react';
import { Button, Field, Modal } from '@healthcareos/react';
import { Form, Formik } from 'formik';
import { object } from 'yup';
import { schema } from '@healthcare/utils';

export interface EditProps {
  location?: string;
  children: (props: { proceed: () => void }) => void;
}

function Edit({ children, location }: EditProps) {
  /**
   * state
   */
  const [state, setState] = useState(false);

  return (
    <>
      {children({ proceed: () => setState(true) })}

      <Modal show={state} onHide={() => setState(false)} header="Edit location">
        <Formik
          validateOnMount
          validationSchema={object({
            name: schema.requireString('Name'),
          })}
          initialValues={{
            name: 'Consulting room 1',
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
                <Field.Group name="name" label="Name of location">
                  <Field.Input name="name" value={values.name} />
                </Field.Group>
              </div>

              <div className="flex gap-6 justify-end py-3 px-6 border-t border-gray-200">
                <Button type="button" className="text-muted">
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={!isValid}
                  className="btn btn-primary"
                  onClick={() => handleSubmit()}
                  {...{ isSubmitting }}
                >
                  Save changes
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </Modal>
    </>
  );
}

export default Edit;
