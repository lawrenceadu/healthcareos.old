import { FieldArray, Form as BaseForm, Formik } from 'formik';
import { array, object, string } from 'yup';
import { AddIcon, DeleteIcon } from '@healthcare/icons';
import { helpers, schema } from '@healthcare/utils';
import { Button, Field } from '@healthcareos/react';
import { useSWRConfig } from 'swr';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';

import { PrescriptionModel } from '../../../../models';
import { usePatient } from '../../../../hooks';
import * as api from '../../../../services/pharmacy';
import SearchSelect from '../../SearchSelect';

function Add({
  onHide,
  params,
  onSuccess,
}: {
  onHide: () => void;
  onSuccess: () => void;
  params?: PrescriptionModel;
}) {
  /**
   * variables
   */
  const initialValues = params
    ? params.medicines.map((i) => ({
        dose: i.dose,
        unit: i.unit,
        route: i.route,
        notes: i.notes,
        schedule: i.schedule,
        start_date: i.start_date || '',
        stop_date: i.stop_date || '',
        administration_time: i.administration_time,
        medicine: { label: i.medicine.name, value: i.medicine.id },
      }))
    : [
        {
          medicine: { label: '', value: '' },
          dose: '',
          unit: '',
          route: '',
          notes: '',
          schedule: '',
          stop_date: '',
          start_date: '',
          administration_time: [],
        },
      ];

  const times = helpers.generateTimeRange();

  /**
   * hooks
   */
  const { patient } = usePatient();
  const { mutate } = useSWRConfig();

  return (
    <Formik
      validateOnMount
      validationSchema={object({
        medicines: schema.requireArray('Prescriptions').of(
          object().shape({
            medicine: object().shape({
              label: schema.requireString('Medicine'),
              value: schema.requireString('Medicine'),
            }),
            dose: schema.requireString('Dose', false),
            unit: schema.requireString('Unit', false),
            route: schema.requireString('Route', false),
            notes: schema.requireString('Notes', false),
            schedule: schema.requireString('Schedule'),
            start_date: string().when('schedule', (schedule, sch) => {
              return schema.requireString('Start date', schedule !== 'stat', sch); // prettier-ignore
            }),
            stop_date: string().when('schedule', (schedule, sch) => {
              return schema.requireString('End date', schedule !== 'stat', sch);
            }),
            administration_time: array(),
          })
        ),
      })}
      initialValues={{
        medicines: initialValues,
      }}
      onSubmit={(
        { medicines, ...data },
        { setSubmitting, setErrors, resetForm }
      ) => {
        const _data = {
          ...data,
          medicines: medicines.map(({ medicine, ...med }) => ({
            ...med,
            id: medicine.value,
          })),
        };

        if (!params) {
          api
            .prescribeMedicationService({ ..._data, patient: patient.id })
            .then(() => {
              toast.success('Prescription created');
              mutate(`/prescription?patient=${patient.id}`);
              resetForm({});
              onSuccess?.();
            })
            .catch((error) => {
              if (error?.message) {
                toast.error(error.message);
              }

              if (error?.fields) {
                setErrors(error.fields || {});
              }
            })
            .finally(() => setSubmitting(false));
        }

        if (params) {
          api
            .updatePrescribedMedicationService(_data, params.id)
            .then(() => {
              toast.success('Updated prescription');
              mutate(`/prescription?patient=${patient.id}`);
              onSuccess?.();
            })
            .catch((error) => {
              if (error?.message) {
                toast.error(error.message);
              }

              if (error?.fields) {
                setErrors(error.fields || {});
              }
            })
            .finally(() => setSubmitting(false));
        }
      }}
    >
      {({ values, isValid, isSubmitting, setFieldValue, setFieldTouched }) => (
        <BaseForm>
          <div className="px-6 mb-10">
            <FieldArray name="medicines">
              {(helper) => (
                <div className="mb-6">
                  <div className="grid gap-6 mb-4">
                    {values.medicines.map((pres, key) => (
                      <div
                        key={key}
                        className="grid gap-4 grid-cols-[minmax(0,1fr)_3rem]"
                      >
                        <div className="grid grid-cols-1 gap-4 pb-4 border-b border-gray-200">
                          <div className="grid gap-4 lg:grid-cols-[400px_repeat(3,minmax(0,1fr))]">
                            <Field.Group
                              label="Medicine"
                              wrapperClassName="!mb-0"
                              name={`medicines.${key}.medicine.label`}
                            >
                              <SearchSelect.Medicines
                                value={pres.medicine}
                                onChange={(value) =>
                                  setFieldValue(
                                    `medicines.${key}.medicine`,
                                    value
                                  )
                                }
                              />
                            </Field.Group>

                            <Field.Group
                              label="Dose"
                              wrapperClassName="!mb-0"
                              name={`medicines.${key}.dose`}
                            >
                              <Field.Input name={`medicines.${key}.dose`} />
                            </Field.Group>

                            <Field.Group
                              name="unit"
                              label="Dose Unit"
                              wrapperClassName="!mb-0"
                            >
                              <Field.Select
                                value={pres.unit}
                                name={`medicines.${key}.unit`}
                                options={helpers.medicineUnits}
                                onChange={({ value }) =>
                                  setFieldValue(`medicines.${key}.unit`, value)
                                }
                              />
                            </Field.Group>

                            <Field.Group
                              name="route"
                              label="Route"
                              wrapperClassName="!mb-0"
                            >
                              <Field.Select
                                value={pres.route}
                                name={`medicines.${key}.route`}
                                options={helpers.medicineRoutes}
                                onChange={({ value }) =>
                                  setFieldValue(`medicines.${key}.route`, value)
                                }
                              />
                            </Field.Group>
                          </div>
                          <div className="grid gap-4 lg:grid-cols-[repeat(3,minmax(0,1fr))_400px]">
                            <Field.Group
                              label="Schedule"
                              wrapperClassName="!mb-0"
                              name={`medicines.${key}.schedule`}
                            >
                              <Field.Select
                                name={`medicines.${key}.schedule`}
                                value={pres.schedule}
                                options={[
                                  { label: 'Stat', value: 'stat' },
                                  { label: 'As required', value: 'required' },
                                  { label: 'Other', value: 'other' },
                                ]}
                                onChange={({ value }) =>
                                  setFieldValue(
                                    `medicines.${key}.schedule`,
                                    value
                                  )
                                }
                              />
                            </Field.Group>

                            {['required', 'other'].includes(pres.schedule) && (
                              <>
                                <Field.Group
                                  label="Start date"
                                  name={`medicines.${key}.start_date`}
                                  wrapperClassName="!mb-0"
                                >
                                  <Field.Date
                                    value={pres.start_date}
                                    name={`medicines.${key}.start_date`}
                                    options={{
                                      minDate: dayjs().startOf('day').toDate(),
                                    }}
                                    {...{ setFieldValue, setFieldTouched }}
                                  />
                                </Field.Group>

                                <Field.Group
                                  label="Stop date"
                                  name={`medicines.${key}.stop_date`}
                                  wrapperClassName="!mb-0"
                                >
                                  <Field.Date
                                    value={pres.stop_date}
                                    name={`medicines.${key}.stop_date`}
                                    options={{
                                      minDate: dayjs(pres.start_date || '')
                                        .add(1, 'day')
                                        .startOf('day')
                                        .toDate(),
                                    }}
                                    {...{ setFieldValue, setFieldTouched }}
                                  />
                                </Field.Group>

                                {pres.schedule === 'other' && (
                                  <Field.Group
                                    name={`medicines.${key}.administration_time`}
                                    label="Administration times"
                                  >
                                    <Field.Select
                                      isMulti
                                      name={`medicines.${key}.administration_time`}
                                      value={pres.administration_time}
                                      options={times}
                                      onChange={(i) =>
                                        setFieldValue(
                                          `medicines.${key}.administration_time`,
                                          i.map((i) => i.value)
                                        )
                                      }
                                    />
                                  </Field.Group>
                                )}
                              </>
                            )}
                          </div>
                          <div className="grid md:grid-cols-2">
                            <Field.Group
                              label="Notes"
                              wrapperClassName="!mb-0"
                              name={`medicines.${key}.notes`}
                            >
                              <Field.Input
                                name={`medicines.${key}.notes`}
                                value={pres.notes || ''}
                              />
                            </Field.Group>
                          </div>
                        </div>

                        {key !== 0 && (
                          <div>
                            <Button
                              type="button"
                              className="mt-6 !px-0 w-full"
                              onClick={() => helper.remove(key)}
                            >
                              <DeleteIcon />
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <Button
                    type="button"
                    className="btn btn-light"
                    onClick={() => helper.push({})}
                  >
                    <AddIcon />
                    <span>Add another medicine</span>
                  </Button>
                </div>
              )}
            </FieldArray>
          </div>

          <div className="modal-footer">
            <Button
              type="button"
              className="btn-light"
              onClick={() => onHide()}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!isValid}
              className="btn btn-primary"
              {...{ isSubmitting }}
            >
              {params ? 'Update prescription' : 'Add prescription'}
            </Button>
          </div>
        </BaseForm>
      )}
    </Formik>
  );
}

export default Add;
