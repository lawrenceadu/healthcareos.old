import { ReactElement, useState } from 'react';
import { Button, Field, Modal } from '@healthcareos/react';
import { helpers, schema } from '@healthcare/utils';
import { Form, Formik } from 'formik';
import { object } from 'yup';
import { toast } from 'react-toastify';
import queryString from 'query-string';
import useSWR from 'swr';
import dayjs from 'dayjs';

import { administerDrugService } from '../../../../services/patient';
import { PrescriptionModel } from '../../../../models';
import { usePatient } from '../../../../hooks';

export interface AdministerProps {
  mutate: () => void;
  children: (props: { proceed: () => void }) => ReactElement;
}

function Administer({ mutate, children }: AdministerProps) {
  /**
   * state
   */
  const [show, setShow] = useState(false);

  /**
   * hook
   */
  const { patient } = usePatient();

  /**
   * variables
   */
  const date = dayjs().format('YYYY-MM-DD');

  /**
   * api
   */
  const { data, isLoading } = useSWR<{
    prescriptions: PrescriptionModel['medicines'];
  }>(
    show &&
      `/prescription/daily?${queryString.stringify({
        patient: patient.id,
        date,
      })}`
  );

  const prescriptions = data?.prescriptions || [];

  return (
    <>
      {children({ proceed: () => setShow(true) })}

      <Modal show={show} onHide={() => setShow(false)} header="Administer drug">
        <Formik
          validateOnMount
          validationSchema={object({
            patient: schema.requireString('Patient'),
            date: schema.requireString('Date'),
            medicines: schema.requireArray('Medicines').of(
              object().shape({
                id: schema.requireString('Medicine'),
                time: schema.requireString('Time'),
              })
            ),
          })}
          initialValues={{
            patient: patient.id,
            date,
            medicines: [],
          }}
          onSubmit={(params, { setSubmitting }) => {
            administerDrugService(params)
              .then(() => {
                mutate();
                toast.success('Drug administration recorded');
                setShow(false);
              })
              .catch((error) => {
                toast.error(error?.message || 'Unable to administer drugs');
              })
              .finally(() => setSubmitting(false));
          }}
        >
          {({ values, isValid, isSubmitting, setFieldValue }) => {
            return (
              <Form>
                <div className="p-6 divide-y divide-neutral-200">
                  {isLoading &&
                    Array.from({ length: 3 }, (_, i) => (
                      <div className="py-3" key={i}>
                        <div className="bg-neutral-200 animate-pulse h-[14px] w-full" />
                      </div>
                    ))}

                  {prescriptions.map((prescription, key) => {
                    const index = values.medicines.findIndex(
                      (i) => i.id === prescription.medicine.id
                    );
                    const checked = index >= 0;

                    return (
                      <div
                        key={key}
                        className={helpers.classNames(
                          'py-3',
                          'flex items-center gap-2'
                        )}
                      >
                        <Field.Checkbox
                          checked={checked}
                          className="!gap-0"
                          onChange={({ currentTarget: { checked } }) => {
                            if (checked) {
                              setFieldValue('medicines', [
                                ...values.medicines,
                                { id: prescription.medicine.id, time: '' },
                              ]);
                            } else {
                              setFieldValue(
                                'medicines',
                                values.medicines.filter(
                                  ({ id }) => id !== prescription.medicine.id
                                )
                              );
                            }
                          }}
                        />
                        <div>
                          <p className="font-medium">
                            {prescription.medicine.name}
                          </p>
                          {!!prescription.administration_time.length && (
                            <p className="text-muted text-xs">
                              Dosage schedule:{' '}
                              {prescription.administration_time.join(', ')}
                            </p>
                          )}
                          {checked && (
                            <Field.Group
                              wrapperClassName="mt-1"
                              name={`medicines.${index}.time`}
                            >
                              <Field.Date
                                placeholder="h:m"
                                name={`medicines.${index}.time`}
                                setFieldValue={(name, value) =>
                                  setFieldValue(
                                    name,
                                    dayjs(value as string).format('HH:mm')
                                  )
                                }
                                options={{
                                  enableTime: true,
                                  noCalendar: true,
                                  dateFormat: 'h:i K',
                                }}
                              />
                            </Field.Group>
                          )}
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
                    Administer drug
                  </Button>
                </div>
              </Form>
            );
          }}
        </Formik>
      </Modal>
    </>
  );
}

export default Administer;
