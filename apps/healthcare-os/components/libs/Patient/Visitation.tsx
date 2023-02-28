import React, { useContext, useState } from 'react';
import { Button, Confirm, Field, Modal } from '@healthcareos/react';
import { Form, Formik } from 'formik';
import { schema } from '@healthcare/utils';
import { object } from 'yup';
import dayjs from 'dayjs';

import { PatientContext } from '../../../contexts/Patient';

export interface VisitationProps {
  children: (props: { proceed: () => void }) => void;
}

function Visitation({ children }: VisitationProps) {
  /**
   * state
   */
  const [show, setShow] = useState(false);

  /**
   * context
   */
  const { patient, setPatient } = useContext(PatientContext);

  /**
   * variable
   */
  const end = patient.in_visitation;

  /**
   * function
   */
  const handleEndVisitation = () =>
    Confirm({
      header: 'End visitation',
      message:
        "You are about to end this patient's visit. Would you like to proceed with this action?",
      buttons: {
        proceed: {
          className: 'btn btn-error',
          value: 'End visitation',
        },
      },
    }).then((proceed) => {
      if (proceed) {
        setPatient({
          ...patient,
          is_admitted: false,
          is_inpatient: false,
          in_visitation: false,
        });
      }
    });

  return (
    <>
      {children({
        proceed: () => (end ? handleEndVisitation() : setShow(true)),
      })}

      <Modal
        show={show}
        onHide={() => setShow(false)}
        header="Start visitation"
      >
        <Formik
          validateOnMount
          validationSchema={object({
            location: schema.requireString('Location'),
          })}
          initialValues={{ location: '' }}
          onSubmit={({ location }, { setSubmitting }) => {
            setPatient({
              ...patient,
              in_visitation: true,
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
                  Start visitation
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </Modal>
    </>
  );
}

export default Visitation;
