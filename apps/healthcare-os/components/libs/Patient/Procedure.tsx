import { useState } from 'react';
import { FieldArray, Form, Formik } from 'formik';
import { Button, Field, Modal } from '@healthcareos/react';
import { AddIcon, DeleteIcon } from '@healthcare/icons';
import { helpers, schema } from '@healthcare/utils';
import { object } from 'yup';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';

import { usePatient } from '../../../hooks';
import * as api from '../../../services/patient';
import SearchSelect from '../SearchSelect';

type ParamsProps = {
  id: string;
  report: string;
  notes: string;
  procedure: { label: string; value: string };
  diagnosis: { label: string; value: string };
  execution_date: string;
  users: { label: string; value: string }[];
};

export interface ProcedureProps {
  params?: ParamsProps;
  children: (props: { proceed: () => void }) => void;
}

export function Procedure({ params, children }: ProcedureProps) {
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
        size="lg"
        onHide={() => setShow(false)}
        header={params ? 'Update procedure' : 'Add procedure'}
      >
        <Formik
          validateOnMount
          enableReinitialize
          validationSchema={object({
            procedures: schema.requireArray('Procedures').of(
              object().shape({
                procedure: object().shape({
                  label: schema.requireString('Label'),
                  value: schema.requireString('Value'),
                }),
                diagnosis: object().shape({
                  label: schema.requireString('Label'),
                  value: schema.requireString('Value'),
                }),
                execution_date: schema.requireString('Execution date'),
                report: schema.requireString('Report'),
                notes: schema.requireString('Notes', false),
                users: schema.requireArray('Users').of(
                  object().shape({
                    label: schema.requireString('Label'),
                    value: schema.requireString('Valaue'),
                  })
                ),
              })
            ),
          })}
          initialValues={{
            procedures: params
              ? [params]
              : [
                  {
                    procedure: { label: '', value: '' },
                    diagnosis: { label: '', value: '' },
                    users: [],
                    execution_date: '',
                    report: '',
                    notes: '',
                  },
                ],
          }}
          onSubmit={(data, { setSubmitting, setErrors }) => {
            const procedures = data.procedures.map(
              ({ procedure, diagnosis, users, ...i }) => ({
                ...i,
                id: procedure.value,
                diagnosis: diagnosis.value,
                users: users.map((i) => i.value),
                status: 'completed',
              })
            );

            if (!params) {
              api
                .requestProcedureService({
                  patient: patient.id,
                  procedures: procedures,
                })
                .then(() => {
                  toast.success('Procedure added');
                  updateHistory();
                  setShow(false);
                })
                .catch((error) =>
                  toast.error(error?.message || 'Unable to record procedure')
                )
                .finally(() => setSubmitting(false));
            }

            if (params) {
              api
                .updateProcedureRequestService(params.id, procedures[0])
                .then(() => {
                  toast.success('Procedure updated');
                  updateHistory();
                  setShow(false);
                })
                .catch((error) =>
                  toast.error(error?.message || 'Unable to update procedure')
                )
                .finally(() => setSubmitting(false));
            }
          }}
        >
          {({
            errors,
            values,
            isValid,
            isSubmitting,
            handleSubmit,
            setFieldValue,
          }) => (
            <Form>
              <div className="px-6 divide-y divide-neutral-200">
                <FieldArray name="procedures">
                  {(helper) => (
                    <>
                      {values.procedures.map((item, key) => (
                        <div
                          key={key}
                          className={helpers.classNames(
                            'py-6',
                            !key
                              ? ''
                              : 'grid gap-4 grid-cols-[minmax(0,1fr)_3rem]'
                          )}
                        >
                          <div className="grid grid-cols-1 gap-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <Field.Group
                                label="Procedure *"
                                name={`procedures.${key}.procedure.value`}
                                wrapperClassName="!mb-0"
                              >
                                <SearchSelect.Procedures
                                  value={item.procedure}
                                  onChange={(value) =>
                                    setFieldValue(
                                      `procedures.${key}.procedure`,
                                      value
                                    )
                                  }
                                />
                              </Field.Group>

                              <Field.Group
                                label="Diagnosis *"
                                name={`procedures.${key}.diagnosis.value`}
                                wrapperClassName="!mb-0"
                              >
                                <SearchSelect.Diagnosis
                                  value={item.diagnosis}
                                  onChange={(value) =>
                                    setFieldValue(
                                      `procedures.${key}.diagnosis`,
                                      value
                                    )
                                  }
                                />
                              </Field.Group>

                              <Field.Group
                                label="Execution date"
                                name={`procedures.${key}.execution_date`}
                              >
                                <Field.Date
                                  name={`procedures.${key}.execution_date`}
                                  value={item.execution_date}
                                  options={{
                                    maxDate: dayjs().toDate(),
                                  }}
                                  {...{ setFieldValue }}
                                />
                              </Field.Group>

                              <Field.Group
                                label="Participants"
                                name={`procedures.${key}.users`}
                              >
                                <SearchSelect.Users
                                  isMulti
                                  value={item.users}
                                  onChange={(value) =>
                                    setFieldValue(
                                      `procedures.${key}.users`,
                                      value
                                    )
                                  }
                                />
                              </Field.Group>
                            </div>

                            <Field.Group
                              label="Report *"
                              name={`procedures.${key}.report`}
                              wrapperClassName="!mb-0"
                            >
                              <Field.Input
                                as="textarea"
                                className="py-4"
                                value={item.report || ''}
                                name={`procedures.${key}.report`}
                              />
                            </Field.Group>

                            <Field.Group
                              label="Notes"
                              name={`procedures.${key}.notes`}
                              wrapperClassName="!mb-0"
                            >
                              <Field.Input
                                as="textarea"
                                className="py-4"
                                value={item.notes || ''}
                                name={`procedures.${key}.notes`}
                              />
                            </Field.Group>
                          </div>
                          {key !== 0 && (
                            <Button
                              type="button"
                              aria-label="Remove"
                              className="!p-0 mt-6"
                              onClick={() => helper.remove(key)}
                            >
                              <DeleteIcon />
                            </Button>
                          )}
                        </div>
                      ))}

                      {!params && (
                        <Button
                          type="button"
                          className="btn-light"
                          onClick={() =>
                            helper.push({
                              investigation: { label: '', value: '' },
                              expected_date: '',
                              notes: '',
                            })
                          }
                        >
                          <AddIcon />
                          <span>Add procedure</span>
                        </Button>
                      )}
                    </>
                  )}
                </FieldArray>
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
                  {params ? 'Update procedure' : 'Add procedure'}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </Modal>
    </>
  );
}

export default Procedure;
