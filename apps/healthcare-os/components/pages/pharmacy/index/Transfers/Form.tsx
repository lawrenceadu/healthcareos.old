import { ReactElement, useState } from 'react';
import { Form as BaseForm, FieldArray, Formik } from 'formik';
import { Button, Field, Modal } from '@healthcareos/react';
import { PlusIcon } from '@healthcare/icons';
import { schema } from '@healthcare/utils';
import { object } from 'yup';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';

import BatchSelect, { medicinesSchema } from '../../Components/BatchSelect';
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
            medicines: medicinesSchema,
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
                          <BatchSelect
                            key={key}
                            index={key}
                            medicine={medicine}
                            medicines={values.medicines}
                            id={medicine?.medicine?.value}
                            remove={() => helper.remove(key)}
                            {...{ setFieldValue, setFieldTouched }}
                          />
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
