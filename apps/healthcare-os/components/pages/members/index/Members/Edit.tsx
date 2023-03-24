import { useState } from 'react';
import { Button, Field, Modal } from '@healthcareos/react';
import { Form, Formik } from 'formik';
import { object } from 'yup';
import { schema } from '@healthcare/utils';

export interface EditProps {
  children: (props: { proceed: () => void }) => void;
}

export default function Edit({ children }: EditProps) {
  /**
   * state
   */
  const [state, setState] = useState(false);

  return (
    <>
      {children({ proceed: () => setState(true) })}
      <Modal show={state} onHide={() => setState(false)} header="Edit role">
        <Formik
          validateOnMount
          validationSchema={object({
            name: schema.requireString('name'),
            role: schema.requireString('Role'),
          })}
          initialValues={{
            name: 'Lawrence Adu',
            role: 'doctor',
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
            <Form className="">
              <div className="p-6">
                <Field.Group name="name" label="Name" disabled>
                  <Field.Input name="name" value={values.name} />
                </Field.Group>

                <Field.Group name="role" label="Role">
                  <Field.Select
                    name="role"
                    value={values.role}
                    options={[{ label: 'Doctor', value: 'doctor' }]}
                    placeholder="Select role"
                    onChange={({ value }: { value: string }) =>
                      setFieldValue('role', value)
                    }
                  />
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
