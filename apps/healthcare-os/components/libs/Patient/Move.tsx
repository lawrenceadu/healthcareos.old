import { useContext, useState } from 'react';
import { Button, Field, Modal } from '@healthcareos/react';
import { Form, Formik } from 'formik';
import { object } from 'yup';
import { schema } from '@healthcare/utils';
import dayjs from 'dayjs';

import { PatientContext } from '../../../contexts/Patient';

export interface MoveProps {
  children: (props: { proceed: () => void }) => void;
}

function Move({ children }: MoveProps) {
  /**
   * state
   */
  const [show, setShow] = useState(false);

  /**
   * context
   */
  const { patient, setPatient } = useContext(PatientContext);

  return (
    <>
      {children({ proceed: () => setShow(true) })}

      <Modal
        show={show}
        onHide={() => setShow(false)}
        header="Move to another location"
      >
        <Formik
          validateOnMount
          validationSchema={object({
            location: schema.requireString('Location'),
          })}
          initialValues={{ location: '' }}
          onSubmit={({ location }) => {
            setPatient({
              ...patient,
              queue: { location, time: dayjs().toISOString() },
            });
            setShow(false);
          }}
        >
          {({ values, isValid, isSubmitting, handleSubmit, setFieldValue }) => (
            <Form>
              <div className="py-10 px-6">
                <Field.Group
                  name="location"
                  label="Select the location this patient needs to visit"
                >
                  <Field.Select
                    name="location"
                    value={values.location}
                    placeholder="Select location"
                    options={[
                      { label: 'Vitals', value: 'vitals' },
                      { label: 'Consultation room', value: 'consultation' },
                      { label: 'Lab', value: 'lab' },
                      { label: 'Investigation room', value: 'investigation' },
                      { label: 'Pharmacy', value: 'pharmacy' },
                    ]}
                    onChange={({ value }: { value: string }) =>
                      setFieldValue('location', value)
                    }
                  />
                </Field.Group>
              </div>

              <div className="py-3 px-6 flex justify-end gap-6 border-t border-gray-200">
                <Button
                  type="button"
                  className="btn btn-light"
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
                  Move patient
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
