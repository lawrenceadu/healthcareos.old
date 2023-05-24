import { ReactElement, useState } from 'react';
import { Button, Field, Modal } from '@healthcareos/react';
import { helpers, schema } from '@healthcare/utils';
import { Form, Formik } from 'formik';
import { object } from 'yup';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';

import { printPrescriptionService } from '../../../../../services/pharmacy';
import { PrescriptionModel } from '../../../../../models';

export interface PrintProps {
  mutate: () => void;
  prescription: PrescriptionModel;
  children: (props: { proceed: () => void }) => ReactElement;
}

function Print({ mutate, prescription, children }: PrintProps) {
  /**
   * state
   */
  const [show, setShow] = useState(false);

  return (
    <>
      {children({ proceed: () => setShow(true) })}

      <Modal
        show={show}
        onHide={() => setShow(false)}
        header="Print Prescription"
      >
        <Formik
          validateOnMount
          enableReinitialize
          validationSchema={object({
            prescription: schema.requireString('Prescripton'),
            medicines: schema.requireArray('Medicines').of(
              object().shape({
                id: schema.requireString('Medicine'),
              })
            ),
          })}
          initialValues={{
            prescription: prescription.id,
            medicines: [],
          }}
          onSubmit={(params, { setSubmitting, setErrors }) => {
            printPrescriptionService({
              ...params,
              patient: prescription.patient.id,
            })
              .then(({ print: { file } }: { print: { file: string } }) => {
                window.open(file);
                mutate();
                setShow(false);
              })
              .catch((error) => {
                if (error?.fields) setErrors(error.fields);
                else toast.error(error?.message || 'Unable to setup print');
              });
          }}
        >
          {({ values, isValid, isSubmitting, setFieldValue }) => (
            <Form>
              <div className="p-6 grid gap-2">
                {prescription.medicines.map((med, key) => {
                  const index = values.medicines.findIndex(
                    (i) => i.id === med.medicine.id
                  );

                  const taken = (() => {
                    if (med.schedule === 'stat') {
                      return 'Now (Stat)';
                    }
                    if (med.schedule === 'required') {
                      return `From ${dayjs(med.start_date).format(
                        'DD MMM YYYY'
                      )} to ${dayjs(med.start_date).format('DD MMM YYYY')}`;
                    }

                    if (med.schedule === 'other') {
                      const diff = dayjs(med.stop_date).diff(
                        med.start_date,
                        'days'
                      );

                      return `${med.administration_time.length} times per day for ${diff} days as required`;
                    }
                  })();

                  return (
                    <div
                      key={key}
                      className={helpers.classNames(
                        'p-4',
                        'border border-gray-200 rounded-lg'
                      )}
                    >
                      <div className="mb-3">
                        <Field.Checkbox
                          name={`medicines.${key}.id`}
                          checked={index >= 0}
                          onChange={({ currentTarget: { checked } }) => {
                            if (checked) {
                              setFieldValue('medicines', [
                                ...values.medicines,
                                { id: med.medicine.id, notes: '' },
                              ]);
                            } else {
                              setFieldValue(
                                'medicines',
                                values.medicines.filter(
                                  (i) => i.id !== med.medicine.id
                                )
                              );
                            }
                          }}
                        >
                          <p className="font-bold">{med.medicine.name}</p>
                        </Field.Checkbox>
                      </div>

                      <div className="grid gap-y-2">
                        {[
                          { label: 'Taken', value: taken || '--' },
                          {
                            label: 'Single dosage',
                            value:
                              med.dose && med.unit
                                ? `${parseInt(med.dose)} ${med.unit}`
                                : '--',
                          },
                          {
                            label: 'Dispense until',
                            value: dayjs(med.stop_date).isValid()
                              ? dayjs(med.stop_date).format('DD MMM YYYY')
                              : med.stop_date || '--',
                          },
                          {
                            label: 'Notes',
                            value: med.notes || '--',
                          },
                        ].map((item, key) => (
                          <div
                            className="grid grid-cols-[6rem,1fr] gap-x-4"
                            key={key}
                          >
                            <small className="text-muted font-medium">
                              {item.label}
                            </small>
                            <small>{item.value}</small>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
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
                  Print prescription
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </Modal>
    </>
  );
}

export default Print;
