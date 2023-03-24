import { ReactElement, useState } from 'react';
import { Form as BaseForm, FieldArray, Formik } from 'formik';
import { Button, Field, Modal } from '@healthcareos/react';
import { DeleteIcon, PlusIcon } from '@healthcare/icons';
import { startCase } from 'lodash';
import { schema } from '@healthcare/utils';
import { object } from 'yup';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';

import { createMedicineAdjustmentService, updateMedicineAdjustmentService } from '../../../../../services/pharmacy'; // prettier-ignore
import { MedicineAdjustmentModel } from '../../../../../models';
import { useLocations } from '../../../../../hooks';
import SearchSelect from '../../../../libs/SearchSelect';

export interface FormInterface {
  mutate?: () => void;
  params?: MedicineAdjustmentModel;
  children: (props: { proceed: () => void }) => ReactElement;
}

function Form({ params, mutate, children }: FormInterface) {
  /**
   * state
   */
  const [show, setShow] = useState(false);

  /**
   * hook
   */
  const locations = useLocations();

  /**
   * variables
   */
  const initialItemValues = {
    item: { label: '', value: '' },
    quantity: 1,
  };

  return (
    <>
      {children({ proceed: () => setShow(true) })}

      <Modal
        size="xl"
        show={show}
        onHide={() => setShow(false)}
        header={params ? 'Update adjustment' : 'Add adjustment'}
      >
        <Formik
          validateOnMount
          validationSchema={object({
            medicines: schema.requireArray('Item').of(
              object().shape({
                medicine: object().shape({
                  label: schema.requireString('Label'),
                  value: schema.requireString('Value'),
                }),
                quantity: schema.requireNumber('Quantity'),
                batch_no: schema.requireString('Batch number'),
                expiry_date: schema.requireString('Expiry date'),
              })
            ),
            notes: schema.requireString('Notes', false),
            location: schema.requireString('Location'),
            reason: schema.requireString('Reason'),
            date: schema.requireString('Date'),
            attachment: schema.requireFile({
              size: 10,
              required: false,
              field: 'Attachment',
              type: ['image', 'pdf'],
            }),
          })}
          initialValues={{
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
            reason: params?.reason || '',
            location: params?.location?.id || '',
            date: params?.date || '',
          }}
          onSubmit={({ medicines, ...data }, { setSubmitting, setErrors }) => {
            const _data = {
              ...data,
              medicines: medicines.map(({ medicine, ...i }) => ({
                ...i,
                id: medicine.value,
              })),
            };

            if (params) {
              updateMedicineAdjustmentService(_data, params.id)
                .then(() => {
                  toast.success('Updated adjustment');
                  setShow(false);
                  mutate?.();
                })
                .catch((error) => setErrors(error?.fields || {}))
                .finally(() => setSubmitting(false));
            }

            if (!params) {
              createMedicineAdjustmentService(_data)
                .then(() => {
                  toast.success('Added adjustment');
                  setShow(false);
                  mutate?.();
                })
                .catch((error) => setErrors(error?.fields || {}))
                .finally(() => setSubmitting(false));
            }
          }}
        >
          {({
            errors,
            values,
            isValid,
            isSubmitting,
            setFieldValue,
            setFieldTouched,
          }) => (
            <BaseForm>
              {JSON.stringify(errors)}
              <div className="p-6 max-h-[600px] overflow-y-auto">
                <div className="mb-6">
                  <p className="mb-4 font-medium">Medicines</p>

                  <FieldArray name="medicines">
                    {(helper) => (
                      <>
                        <div className="grid gap-4 mb-4">
                          {values.medicines.map((medicine, key) => (
                            <div key={key}>
                              <div className="grid gap-4 md:grid-cols-[repeat(4,minmax(0,1fr)),3rem]">
                                <Field.Group
                                  label="Medicine"
                                  wrapperClassName="!mb-0"
                                  name={`medicines.${key}.medicine.label`}
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
                                  wrapperClassName="!mb-0"
                                  label="Quantity"
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
                                  <Field.Input
                                    name={`medicines.${key}.batch_no`}
                                  />
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
                            </div>
                          ))}
                        </div>

                        <Button
                          type="button"
                          className="btn btn-light"
                          onClick={() => helper.push(initialItemValues)}
                        >
                          <PlusIcon />
                          <span>Add new item</span>
                        </Button>
                      </>
                    )}
                  </FieldArray>
                </div>

                <Field.Group name="location" label="Location">
                  <Field.Select
                    name="location"
                    value={values.location}
                    options={locations?.map((i) => ({
                      label: i.name,
                      value: i.id,
                    }))}
                    onChange={({ value }: { value: string }) =>
                      setFieldValue('location', value)
                    }
                  />
                </Field.Group>

                <Field.Group name="reason" label="Reason">
                  <Field.Select
                    name="reason"
                    value={values.reason}
                    onChange={({ value }) => setFieldValue('reason', value)}
                    options={['damage', 'counting', 'expiry', 'other'].map(
                      (i) => ({ label: startCase(i), value: i })
                    )}
                  />
                </Field.Group>

                <Field.Group name="date" label="Date">
                  <Field.Date
                    name="date"
                    value={values.date}
                    options={{ maxDate: dayjs().toDate() }}
                    {...{ setFieldValue, setFieldTouched }}
                  />
                </Field.Group>

                <Field.Group name="notes" label="Notes">
                  <Field.Input
                    name="notes"
                    as="textarea"
                    className="py-4"
                    value={values.notes}
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
                  {params ? 'Update adjustment' : 'Add adjustment'}
                </Button>
              </div>
            </BaseForm>
          )}
        </Formik>
      </Modal>
    </>
  );
}

export default Form;
