import { useState } from 'react';
import { FieldArray, Form, Formik } from 'formik';
import { Button, Field, Modal } from '@healthcareos/react';
import { AddIcon, DeleteIcon } from '@healthcare/icons';
import { schema } from '@healthcare/utils';
import { object } from 'yup';
import { toast } from 'react-toastify';

import { usePatient } from '../../../hooks';
import * as api from '../../../services/patient';
import SearchSelect from '../SearchSelect';

type ParamsProps = {
  history_examination: string;
  diagnosis: { label: string; value: string }[];
  plan: string;
  id: string;
};

export interface ConsultationProps {
  params?: ParamsProps;
  children: (props: { proceed: () => void }) => void;
}

export function Consultation({ params, children }: ConsultationProps) {
  /**
   * state
   */
  const [show, setShow] = useState(false);

  /**
   * hooks
   */
  const { patient, updateHistory } = usePatient();

  return (
    <>
      {children({ proceed: () => setShow(true) })}

      <Modal
        show={show}
        onHide={() => setShow(false)}
        header={params ? 'Update consultation' : 'Add consultation'}
      >
        <Formik
          validateOnMount
          enableReinitialize
          validationSchema={object({
            history_examination: schema.requireString(
              'History and examination'
            ),
            diagnosis: schema.requireArray('Diagnosis', false).of(
              object().shape({
                label: schema.requireString('Label'),
                value: schema.requireString('Value'),
              })
            ),
            plan: schema.requireString('Plan'),
          })}
          initialValues={{
            plan: params?.plan || '',
            history_examination: params?.history_examination,
            diagnosis: params?.diagnosis || [],
          }}
          onSubmit={(data, { setSubmitting, setErrors }) => {
            // cleanup data
            const formattedData = {
              ...data,
              diagnosis: data.diagnosis.map((i) => i.value),
            };

            // for new consultation
            if (!params) {
              api
                .createConsultationService({
                  ...formattedData,
                  patient: patient.id,
                })
                .then(() => {
                  toast.success('Consultation added');
                  updateHistory();
                  setShow(false);
                })
                .catch(() => null)
                .finally(() => setSubmitting(false));
            }

            // update consultation
            if (params) {
              api
                .updateConsultationService(
                  { ...formattedData, patient: patient.id },
                  params.id
                )
                .then(() => {
                  toast.success('Consultation updated');
                  updateHistory();
                  setShow(false);
                })
                .catch(() => null)
                .finally(() => setSubmitting(false));
            }
          }}
        >
          {({ values, isValid, isSubmitting, handleSubmit, setFieldValue }) => (
            <Form>
              <div className="p-6">
                <Field.Group
                  name="history_examination"
                  label="History and Examination"
                >
                  <Field.Input
                    as="textarea"
                    className="py-4"
                    name="history_examination"
                    value={values.history_examination}
                  />
                </Field.Group>

                <div className="mb-6">
                  <p className="text-sm mb-1">Diagnosis</p>
                  <FieldArray name="diagnosis">
                    {(helpers) => (
                      <>
                        <div className="flex flex-col gap-4 mb-4">
                          {values.diagnosis.map((diagnosis, key) => (
                            <Field.Group
                              key={key}
                              name={`diagnosis.${key}`}
                              wrapperClassName="!mb-0"
                            >
                              <SearchSelect.Diagnosis
                                value={diagnosis}
                                onChange={(option) => {
                                  if (
                                    !values.diagnosis
                                      .map((i) => i.value)
                                      .includes(option.value)
                                  )
                                    setFieldValue(`diagnosis.${key}`, option);
                                }}
                              />
                              {key !== 0 && (
                                <Button
                                  type="button"
                                  aria-label="Remove"
                                  className="!py-0"
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
                          <span>Add another diagnosis</span>
                        </Button>
                      </>
                    )}
                  </FieldArray>
                </div>

                <Field.Group name="plan" label="Plan">
                  <Field.Input
                    as="textarea"
                    name="plan"
                    className="py-4"
                    value={values.plan}
                  />
                </Field.Group>
              </div>

              <div className="modal-footer">
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
                  {...{ isSubmitting }}
                >
                  {params ? 'Update consultation' : 'Add consultation'}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </Modal>
    </>
  );
}

export default Consultation;
