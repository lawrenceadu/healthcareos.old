import { useState } from 'react';
import { FieldArray, Form, Formik } from 'formik';
import { Button, Field, Modal } from '@healthcareos/react';
import { AddIcon, DeleteIcon } from '@healthcare/icons';
import { schema } from '@healthcare/utils';
import { object } from 'yup';

import { dischargePatientService } from '../../../services/admission';
import { usePatient } from '../../../hooks';
import SearchSelect from '../SearchSelect';

export interface DischargeProps {
  children: (props: { proceed: () => void }) => void;
}

function Discharge({ children }: DischargeProps) {
  /**
   * state
   */
  const [show, setShow] = useState(false);

  /**
   * hook
   */
  const { patient, mutate, updateHistory } = usePatient();

  return (
    <>
      {children({ proceed: () => setShow(true) })}

      <Modal
        show={show}
        onHide={() => setShow(false)}
        header="Discharge patient"
      >
        <Formik
          validateOnMount
          enableReinitialize
          validationSchema={object({
            diagnosis: schema.requireArray('Diagnosis').of(
              object().shape({
                label: schema.requireString('Diagnosis'),
                value: schema.requireString('Diagnosis'),
              })
            ),
            outcome: schema.requireString('Outcome'),
            status: schema.requireString('Status'),
            notes: schema.requireString('Notes'),
          })}
          initialValues={{
            diagnosis: [{ label: '', value: '' }],
            status: 'discharge',
            outcome: '',
            notes: '',
          }}
          onSubmit={(
            { diagnosis, ...params },
            { setSubmitting, setErrors }
          ) => {
            const data = {
              ...params,
              diagnosis: diagnosis.map(({ value }) => value),
              patient: patient.id,
            };

            dischargePatientService(data)
              .then(() => {
                updateHistory();
                mutate();

                setShow(false);
              })
              .catch((error) => setErrors(error?.fields || {}))
              .finally(() => setSubmitting(false));
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
            <Form className="p-6">
              <div className="mb-6">
                <p className="text-sm mb-1">Discharge diagnosis</p>

                <FieldArray name="diagnosis">
                  {(helpers) => (
                    <>
                      <div className="flex flex-col gap-4 mb-4">
                        {values.diagnosis.map((diagnosis, key) => (
                          <Field.Group
                            key={key}
                            name={`diagnosis.${key}.label`}
                            wrapperClassName="!mb-0"
                          >
                            <SearchSelect.Diagnosis
                              value={diagnosis}
                              onChange={(value) =>
                                setFieldValue(`diagnosis.${key}`, value)
                              }
                            />
                            {key !== 0 && (
                              <Button
                                type="button"
                                className="!py-0"
                                aria-label="Remove"
                                onClick={() => helpers.remove(key)}
                              >
                                <DeleteIcon />
                              </Button>
                            )}
                          </Field.Group>
                        ))}
                      </div>
                      <Button
                        type="button"
                        className="btn-light"
                        onClick={() => helpers.push('')}
                      >
                        <AddIcon />
                        <span>Add diagnosis</span>
                      </Button>
                    </>
                  )}
                </FieldArray>
              </div>

              <div className="mb-6">
                <small className="mb-4 block">Outcome</small>
                <div className="flex flex-wrap gap-x-6 gap-y-2">
                  {[
                    { label: 'Absconded', value: 'absconded' },
                    { label: 'Death', value: 'death' },
                    { label: 'Discharge home', value: 'discharge-home' },
                    { label: 'Referral', value: 'referral' },
                    { label: 'Self discharge', value: 'self-discharge' },
                  ].map((i, key) => (
                    <Field.Radio key={key} name="outcome" value={i.value}>
                      {i.label}
                    </Field.Radio>
                  ))}
                </div>
              </div>

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
                className="btn btn-primary w-full"
                {...{ isSubmitting }}
              >
                Discharge patient
              </Button>
            </Form>
          )}
        </Formik>
      </Modal>
    </>
  );
}

export default Discharge;
