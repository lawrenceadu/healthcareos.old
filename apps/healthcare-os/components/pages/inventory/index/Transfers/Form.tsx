import { ReactElement, useState } from 'react';
import { Form as BaseForm, FieldArray, Formik } from 'formik';
import { Button, Field, Modal } from '@healthcareos/react';
import { DeleteIcon, PlusIcon } from '@healthcare/icons';
import { schema } from '@healthcare/utils';
import { object } from 'yup';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';

import { ItemTransferModel } from '../../../../../models';
import * as api from '../../../../../services/inventory';
import SearchSelect from '../../../../libs/SearchSelect';

export interface FormProps {
  mutate: () => void;
  params?: ItemTransferModel;
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
        size="lg"
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
            items: schema.requireArray('Items').of(
              object().shape({
                item: object().shape({
                  label: schema.requireString('Label'),
                  value: schema.requireString('Value'),
                }),
                quantity: schema.requireNumber('Quantity'),
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
            items: params?.details
              ? params.details.map((i) => ({
                  item: { label: i.item.name, value: i.item.id },
                  quantity: i.quantity,
                }))
              : [{ item: { label: '', value: '' }, quantity: '' }],
            notes: params?.notes || '',
          }}
          onSubmit={(
            { items, from_location, to_location, ...data },
            { setSubmitting, setErrors }
          ) => {
            const _data = {
              ...data,
              from_location: from_location.value,
              to_location: to_location.value,
              items: items.map((i) => ({
                id: i.item.value,
                quantity: i.quantity,
              })),
            };

            if (params) {
              api
                .updateItemTransferService(_data, params.id)
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
                .createItemTransferService(_data)
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
                <FieldArray name="items">
                  {(helper) => (
                    <div className="mb-6">
                      <p className="text-lg mb-4 font-medium">Items</p>
                      <div className="mb-4 grid gap-4">
                        {values.items.map((item, key) => (
                          <div
                            key={key}
                            className="grid gap-4 md:grid-cols-[repeat(2,minmax(0,1fr)),3rem]"
                          >
                            <Field.Group
                              label="Item"
                              name={`items.${key}.item.label`}
                              wrapperClassName="!mb-0"
                            >
                              <SearchSelect.Items
                                value={item.item}
                                onChange={(value) =>
                                  setFieldValue(`items.${key}.item`, value)
                                }
                              />
                            </Field.Group>

                            <Field.Group
                              name={`items.${key}.quantity`}
                              label="Quantity"
                              wrapperClassName="!mb-0"
                            >
                              <Field.Input
                                type="number"
                                name={`items.${key}.quantity`}
                                value={item.quantity}
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
                            item: { label: '', value: '' },
                            quantity: '',
                          })
                        }
                      >
                        <PlusIcon />
                        <span>Add new item</span>
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
