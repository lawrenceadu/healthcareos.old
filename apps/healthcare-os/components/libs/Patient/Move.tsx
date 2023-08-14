import { useState } from 'react';
import { Button, Field, Modal } from '@healthcareos/react';
import { Form, Formik } from 'formik';
import { object } from 'yup';
import { schema } from '@healthcare/utils';
import { toast } from 'react-toastify';

import { useLocations, usePatient } from '../../../hooks';
import { addToQueueService } from '../../../services/patient';

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
  const { patient, updateHistory } = usePatient();

  /**
   * hook
   */
  const locations = useLocations();

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
          onSubmit={({ location }, { setSubmitting, setErrors }) => {
            addToQueueService({ location, patient: patient.id })
              .then(() => {
                toast.success('Patient has been added to queue');
                updateHistory();
                setShow(false);
              })
              .catch((error) => setErrors(error?.fields || {}))
              .finally(() => setSubmitting(false));
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
                    options={locations?.map((i) => ({
                      label: i.name,
                      value: i.id,
                    }))}
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
