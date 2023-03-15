import { useState } from 'react';
import { Button, Field, Modal } from '@healthcareos/react';
import { Form, Formik } from 'formik';
import { schema } from '@healthcare/utils';
import { object } from 'yup';
import { toast } from 'react-toastify';

import { usePatient } from '../../../hooks';

export interface AdmitProps {
  children: (props: { proceed: () => void }) => void;
}

function Admit({ children }: AdmitProps) {
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

      <Modal show={show} onHide={() => setShow(false)} header="Admit patient">
        <Formik
          validateOnMount
          validationSchema={object({
            notes: schema.requireString('Notes'),
          })}
          initialValues={{
            notes: '',
          }}
          onSubmit={() => {
            toast.success('Patient admitted');
            setShow(false);
          }}
        >
          {({ values, isValid, isSubmitting, handleSubmit }) => (
            <Form className="p-6">
              <p className="mb-6">
                You are about to admit this patient. Kindly add any relevant
                notes below
              </p>

              <Field.Group name="notes" label="Notes">
                <Field.Input
                  name="notes"
                  as="textarea"
                  className="py-4"
                  value={values.notes}
                  placeholder="Type notes here..."
                />
              </Field.Group>

              <Button
                type="submit"
                disabled={!isValid}
                onClick={() => handleSubmit()}
                className="btn btn-primary w-full"
                {...{ isSubmitting }}
              >
                Admit patient
              </Button>
            </Form>
          )}
        </Formik>
      </Modal>
    </>
  );
}

export default Admit;
