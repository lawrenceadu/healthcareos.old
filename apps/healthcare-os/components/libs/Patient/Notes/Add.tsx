import { useState } from 'react';
import { Button, Field, Modal } from '@healthcareos/react';
import { Form, Formik } from 'formik';
import { schema } from '@healthcare/utils';
import { object } from 'yup';
import { toast } from 'react-toastify';

import { createPatientNotesService } from '../../../../services/patient';
import { usePatient } from '../../../../hooks';

export interface AddProps {
  children: (props: { proceed: () => void }) => void;
  mutate: () => void;
}

export function Add({ children, mutate }: AddProps) {
  /**
   * state
   */
  const [show, setShow] = useState(false);

  /**
   * hook
   */
  const { patient } = usePatient();

  return (
    <>
      {children({ proceed: () => setShow(true) })}

      <Modal show={show} onHide={() => setShow(false)} header="Add notes">
        <Formik
          validateOnMount
          validationSchema={object({ notes: schema.requireString('Notes') })}
          initialValues={{ notes: '' }}
          onSubmit={(params, { setSubmitting, setErrors }) => {
            createPatientNotesService({ ...params, patient: patient.id })
              .then(() => {
                mutate();
                toast.success('Notes added');
                setShow(false);
              })
              .catch((error) => {
                if (error?.fields) {
                  setErrors(error.fields);
                }

                if (error?.message) {
                  toast.error(error.message);
                }
              })
              .finally(() => setSubmitting(false));
          }}
        >
          {({ values, isValid, isSubmitting, handleSubmit }) => (
            <Form>
              <div className="p-6">
                <Field.Group name="notes" label="Notes">
                  <Field.Input
                    as="textarea"
                    name="notes"
                    className="py-4"
                    values={values.notes}
                    placeholder="Type notes here..."
                  />
                </Field.Group>
              </div>
              <div className="py-3 px-6 border-t border-gray-200 flex gap-6 justify-end">
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
                  Add note
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </Modal>
    </>
  );
}

export default Add;
