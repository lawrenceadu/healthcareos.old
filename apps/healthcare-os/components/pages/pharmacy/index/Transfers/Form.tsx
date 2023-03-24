import { ReactElement, useState } from 'react';
import { Form as BaseForm, FieldArray, Formik } from 'formik';
import { Button, Field, Modal } from '@healthcareos/react';
import { DeleteIcon, PlusIcon } from '@healthcare/icons';
import { schema } from '@healthcare/utils';
import { object } from 'yup';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';

import { MedicineTransferModel } from '../../../../../models';
import * as api from '../../../../../services/pharmacy';
import SearchSelect from '../../../../libs/SearchSelect';

export interface FormProps {
  mutate: () => void;
  params?: MedicineTransferModel;
  children: ({ proceed }: { proceed: () => void }) => ReactElement;
}

export default function Form({ mutate, params, children }: FormProps) {
  /**
   * state
   */
  const [show, setShow] = useState(false);

  return (
    <>
      {children({ proceed: () => setShow(true) })}

      <Modal
        size="xl"
        show={show}
        onHide={() => setShow(false)}
        header={!params ? 'Add transfer' : 'Update transfer'}
      >
        <Formik
          validateOnMount
          enableReinitialize
          validationSchema={object({
            from_location: object().shape({
              label: schema.requireString('Location'),
              value: schema.requireString('Location'),
            }),
            to_location: object().shape({
              label: schema.requireString('Location'),
              value: schema.requireString('Location'),
            }),
            date: schema.requireString('Date'),
            medicines: schema.requireArray('Medicines').of(
              object().shape({
                medicine: object().shape({
                  label: schema.requireString('Medicine'),
                  value: schema.requireString('Medicine'),
                }),
                quantity: schema.requireNumber('Quantity'),
                batch_no: schema.requireString('Batch number'),
                expiry_date: schema.requireString('Expiry date'),
              })
            ),
            notes: schema.requireString('Notes', false),
          })}
          initialValues={{
            from_location: params?.from_location
              ? {
                  label: params.from_location.name,
                  value: params.from_location.id,
                }
              : { label: '', value: '' },
            to_location: params?.to_location
              ? { label: params.to_location.name, value: params.to_location.id }
              : { label: '', value: '' },
            date: params?.date || '',
            medicines: params?.details
              ? params.details.map((i) => ({
                  medicine: { label: i.medicine.name, value: i.medicine.id },
                  quantity: i.quantity,
                  batch_no: i.batch_no,
                  expiry_date: i.expiry_date,
                }))
              : [
                  {
                    medicine: { label: '', value: '' },
                    quantity: '',
                    batch_no: '',
                    expiry_date: '',
                  },
                ],
            notes: params?.notes || '',
          }}
          onSubmit={(
            { medicines, from_location, to_location, ...data },
            { setSubmitting, setErrors }
          ) => {
            const _data = {
              ...data,
              from_location: from_location.value,
              to_location: to_location.value,
              medicines: medicines.map(({ medicine, ...i }) => ({
                id: medicine.value,
                ...i,
              })),
            };

            if (params) {
              api
                .updateMedicineTransferService(_data, params.id)
                .then(() => {
                  toast.success('Updated transfer');
                  setShow(false);
                  mutate?.();
                })
                .catch((error) => {
                  if (error?.fields) setErrors(error?.fields || {});
                  if (error?.message) toast.error(error.message);
                })
                .finally(() => setSubmitting(false));
            }

            if (!params) {
              api
                .createMedicineTransferService(_data)
                .then(() => {
                  toast.success('Transfer created');
                  setShow(false);
                  mutate?.();
                })
                .catch((error) => {
                  if (error?.fields) setErrors(error?.fields || {});
                  if (error?.message) toast.error(error.message);
                })
                .finally(() => setSubmitting(false));
            }
          }}
        >
          {({
            values,
            isValid,
            isSubmitting,
            setFieldValue,
            setFieldTouched,
          }) => (
            <BaseForm>
              <div className="p-6">
                <FieldArray name="medicines">
                  {(helper) => (
                    <div className="mb-6">
                      <p className="text-lg mb-4 font-medium">Medicines</p>
                      <div className="mb-4 grid gap-4">
                        {values.medicines.map((medicine, key) => (
                          <div
                            key={key}
                            className="grid gap-4 md:grid-cols-[repeat(4,minmax(0,1fr)),3rem]"
                          >
                            <Field.Group
                              label="Medicine"
                              name={`medicines.${key}.medicine.label`}
                              wrapperClassName="!mb-0"
                            >
                              <SearchSelect.Medicines
                                value={medicine.medicine}
                                onChange={(value) =>
                                  setFieldValue(
                                    `medicines.${key}.medicine`,
                                    value
                                  )
                                }
                              />
                            </Field.Group>

                            <Field.Group
                              name={`medicines.${key}.quantity`}
                              label="Quantity"
                              wrapperClassName="!mb-0"
                            >
                              <Field.Input
                                type="number"
                                name={`medicines.${key}.quantity`}
                                value={medicine.quantity}
                              />
                            </Field.Group>

                            <Field.Group
                              label="Batch no"
                              name={`medicines.${key}.batch_no`}
                              wrapperClassName="!mb-0"
                            >
                              <Field.Input name={`medicines.${key}.batch_no`} />
                            </Field.Group>

                            <Field.Group
                              label="Expiry date"
                              name={`medicines.${key}.expiry_date`}
                              wrapperClassName="!mb-0"
                            >
                              <Field.Date
                                value={medicine.expiry_date}
                                name={`medicines.${key}.expiry_date`}
                                {...{ setFieldValue, setFieldTouched }}
                              />
                            </Field.Group>

                            {!!key && (
                              <Button
                                type="button"
                                aria-label="Delete"
                                className="mt-6 !px-0 w-full"
                                onClick={() => helper.remove(key)}
                              >
                                <DeleteIcon />
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                      <Button
                        type="button"
                        className="btn-light"
                        onClick={() =>
                          helper.push({
                            medicine: { label: '', value: '' },
                            quantity: '',
                          })
                        }
                      >
                        <PlusIcon />
                        <span>Add new medicine</span>
                      </Button>
                    </div>
                  )}
                </FieldArray>

                <div className="grid gap-4 md:grid-cols-2 mb-6">
                  <Field.Group name="from_location" label="From location">
                    <SearchSelect.Locations
                      value={values.from_location}
                      onChange={(value) =>
                        setFieldValue('from_location', value)
                      }
                    />
                  </Field.Group>

                  <Field.Group name="to_location" label="Location to">
                    <SearchSelect.Locations
                      value={values.to_location}
                      onChange={(value) => setFieldValue('to_location', value)}
                    />
                  </Field.Group>
                </div>

                <Field.Group name="date" label="Date">
                  <Field.Date
                    name="date"
                    value={values.date}
                    options={{ maxDate: dayjs().add(5, 'minutes').toDate() }}
                    {...{ setFieldValue, setFieldTouched }}
                  />
                </Field.Group>

                <Field.Group name="notes" label="Notes">
                  <Field.Input
                    as="textarea"
                    name="notes"
                    className="py-4"
                    value={values.notes}
                  />
                </Field.Group>
              </div>

              <div className="modal-footer">
                <Button
                  type="button"
                  className="text-muted"
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
                  {params ? 'Update' : 'Transfer'}
                </Button>
              </div>
            </BaseForm>
          )}
        </Formik>
      </Modal>
    </>
  );
}
