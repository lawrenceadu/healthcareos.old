import { ReactElement, useState } from 'react';
import { Form as BaseForm, FieldArray, Formik } from 'formik';
import { Button, Field, Modal } from '@healthcareos/react';
import { DeleteIcon, PlusIcon } from '@healthcare/icons';
import { schema } from '@healthcare/utils';
import { object } from 'yup';
import { toast } from 'react-toastify';

import { createMedicinePurchaseService, updateMedicinePurchaseService } from '../../../../../services/pharmacy'; // prettier-ignore
import { useLocations, useStore } from '../../../../../hooks';
import { MedicinePurchaseModel } from '../../../../../models';
import SearchSelect from '../../../../libs/SearchSelect';
import dayjs from 'dayjs';

export interface FormInterface {
  mutate?: () => void;
  params?: MedicinePurchaseModel;
  children: (props: { proceed: () => void }) => ReactElement;
}

function Form({ params, mutate, children }: FormInterface) {
  /**
   * state
   */
  const [show, setShow] = useState(false);

  /**
   * store
   */
  const { store } = useStore();

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
    unit_price: 0,
    discount: 0,
  };

  /**
   * function
   */
  const handleSubtotal = (
    items: { unit_price: number; quantity: number; discount: number }[]
  ): number => {
    return items
      .map((i) => ({
        quantity: i.quantity,
        unit_price: i.unit_price,
        discount: i.discount,
      }))
      .reduce((a, b) => a + (b.quantity * b.unit_price - b.discount), 0);
  };

  return (
    <>
      {children({ proceed: () => setShow(true) })}

      <Modal
        size="lg"
        show={show}
        onHide={() => setShow(false)}
        header={params ? 'Update purchase' : 'Add purchase'}
      >
        <Formik
          validateOnMount
          validationSchema={object({
            supplier: object().shape({
              label: schema.requireString('Label'),
              value: schema.requireString('Value'),
            }),
            items: schema.requireArray('Item').of(
              object().shape({
                item: object().shape({
                  label: schema.requireString('Label'),
                  value: schema.requireString('Value'),
                }),
                batch_no: schema.requireString('Batch number'),
                expiry_date: schema.requireString('Expiry date'),
                quantity: schema.requireNumber('Quantity'),
                unit_price: schema.requireNumber('Unit price'),
                discount: schema
                  .requireNumber('Discount')
                  .test(
                    'is-more',
                    'Discount cannout be more than subtotal price',
                    (value, { parent }) => {
                      const subtotal = parent.quantity * parent.unit_price;
                      return !(value > subtotal);
                    }
                  ),
              })
            ),
            discount: schema
              .requireNumber('Discount')
              .min(0, 'Discount cannot be less than 0'),
            notes: schema.requireString('Notes', false),
            location: schema.requireString('Location'),
            date: schema.requireString('Date'),
            attachment: schema.requireFile({
              size: 10,
              required: false,
              field: 'Attachment',
              type: ['image', 'pdf'],
            }),
          })}
          initialValues={{
            supplier: params?.supplier
              ? { label: params?.supplier?.name, value: params?.supplier?.id }
              : { label: '', value: '' },
            items: params?.details
              ? params.details.map((i) => ({
                  item: { label: i.medicine.name, value: i.medicine.id },
                  batch_no: i.batch_no,
                  expiry_date: i.expiry_date,
                  quantity: i.quantity,
                  unit_price: i.unit_price,
                  discount: i.discount,
                }))
              : [
                  {
                    item: { label: '', value: '' },
                    quantity: '',
                    unit_price: '',
                    discount: 0,
                  },
                ],
            discount: params?.discount || 0,
            notes: params?.notes || '',
            location: params?.location?.id || '',
            date: params?.date || '',
          }}
          onSubmit={(
            { items, supplier, ...data },
            { setSubmitting, setErrors }
          ) => {
            const _data = {
              ...data,
              supplier: supplier.value,
              medicines: items.map(({ item, ...i }) => ({
                ...i,
                id: item.value,
              })),
            };

            if (params) {
              updateMedicinePurchaseService(_data, params.id)
                .then(() => {
                  toast.success('Updated purchase');
                  setShow(false);
                  mutate?.();
                })
                .catch((error) => setErrors(error?.fields || {}))
                .finally(() => setSubmitting(false));
            }

            if (!params) {
              createMedicinePurchaseService(_data)
                .then(() => {
                  toast.success('Added purchase');
                  setShow(false);
                  mutate?.();
                })
                .catch((error) => setErrors(error?.fields || {}))
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
              <div className="p-6 lg:max-h-[600px] overflow-y-auto">
                <Field.Group name="supplier" label="Supplier">
                  <SearchSelect.Suppliers
                    value={values.supplier}
                    onChange={(value) => setFieldValue('supplier', value)}
                  />
                </Field.Group>

                <div className="mb-6">
                  <p className="mb-4 font-medium">Items</p>

                  <FieldArray name="items">
                    {(helper) => (
                      <>
                        <div className="grid gap-4 mb-4">
                          {values.items.map((item, key) => (
                            <div
                              key={key}
                              className="border-b border-gray-200 pb-4"
                            >
                              <div className="flex gap-4">
                                <div className="grid md:grid-cols-3 gap-4 mb-2">
                                  <Field.Group
                                    label="Medicine"
                                    wrapperClassName="!mb-0"
                                    name={`items.${key}.item.label`}
                                  >
                                    <SearchSelect.Medicines
                                      value={item.item}
                                      onChange={(value) =>
                                        setFieldValue(
                                          `items.${key}.item`,
                                          value
                                        )
                                      }
                                    />
                                  </Field.Group>

                                  <Field.Group
                                    name={`items.${key}.batch_no`}
                                    wrapperClassName="!mb-0"
                                    label="Batch No."
                                  >
                                    <Field.Input
                                      name={`items.${key}.batch_no`}
                                      value={item.batch_no}
                                    />
                                  </Field.Group>

                                  <Field.Group
                                    name={`items.${key}.expiry_date`}
                                    wrapperClassName="!mb-0"
                                    label="Expiry date"
                                  >
                                    <Field.Date
                                      value={item.expiry_date}
                                      name={`items.${key}.expiry_date`}
                                      {...{ setFieldValue, setFieldTouched }}
                                    />
                                  </Field.Group>

                                  <Field.Group
                                    name={`items.${key}.quantity`}
                                    wrapperClassName="!mb-0"
                                    label="Quantity"
                                  >
                                    <Field.Input
                                      type="number"
                                      name={`items.${key}.quantity`}
                                      value={item.quantity}
                                    />
                                  </Field.Group>

                                  <Field.Group
                                    name={`items.${key}.unit_price`}
                                    wrapperClassName="!mb-0"
                                    label="Unit price"
                                  >
                                    <span className="pl-4">
                                      {store.facility.currency_symbol}
                                    </span>
                                    <Field.Input
                                      type="number"
                                      className="!px-0"
                                      value={item.unit_price}
                                      name={`items.${key}.unit_price`}
                                    />
                                  </Field.Group>
                                  <Field.Group
                                    name={`items.${key}.discount`}
                                    wrapperClassName="!mb-0"
                                    label="Discount"
                                  >
                                    <span className="pl-4">
                                      {store.facility.currency_symbol}
                                    </span>
                                    <Field.Input
                                      type="number"
                                      className="!px-0"
                                      value={item.discount}
                                      name={`items.${key}.discount`}
                                    />
                                  </Field.Group>
                                </div>
                                {!!key && (
                                  <Button
                                    type="button"
                                    aria-label="Delete"
                                    onClick={() => helper.remove(key)}
                                  >
                                    <DeleteIcon />
                                  </Button>
                                )}
                              </div>

                              <div className="flex gap-4">
                                <small>
                                  <b>Subtotal</b>:{' '}
                                  {`${store.facility.currency_symbol} ${
                                    item.unit_price * item.quantity
                                  }`}
                                </small>

                                <small>
                                  <b>Total</b>:{' '}
                                  {`${store.facility.currency_symbol} ${
                                    item.unit_price * item.quantity -
                                    item.discount
                                  }`}
                                </small>
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

                <Field.Group name="discount" label="Discount">
                  <span className="pl-4">{store.facility.currency_symbol}</span>
                  <Field.Input
                    type="number"
                    name="discount"
                    className="!px-0"
                    value={values.discount}
                  />
                </Field.Group>

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
                <div className="mr-auto flex gap-4">
                  <p>
                    <b>Subtotal:</b> {store.facility.currency_symbol}{' '}
                    {handleSubtotal(
                      values.items.map((i) => ({
                        discount: i.discount,
                        unit_price: i.unit_price,
                        quantity: i.quantity,
                      }))
                    )}
                  </p>

                  <p>
                    <b>Total:</b> {store.facility.currency_symbol}{' '}
                    {handleSubtotal(
                      values.items.map((i) => ({
                        discount: i.discount,
                        unit_price: i.unit_price,
                        quantity: i.quantity,
                      }))
                    ) - values.discount}
                  </p>
                </div>
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
                  {params ? 'Update purchase' : 'Add purchase'}
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
