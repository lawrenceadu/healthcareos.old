import { ReactElement, useState } from 'react';
import { Form as BaseForm, FieldArray, Formik } from 'formik';
import { Button, Field, Modal } from '@healthcareos/react';
import { DeleteIcon, PlusIcon } from '@healthcare/icons';
import { schema } from '@healthcare/utils';
import { object } from 'yup';
import { toast } from 'react-toastify';

import { createItemStockService, updateItemStockService } from '../../../../../services/inventory'; // prettier-ignore
import { useLocations, useStore } from '../../../../../hooks';
import { ItemStockModel } from '../../../../../models';
import SearchSelect from '../../../../libs/SearchSelect';

export interface FormInterface {
  mutate?: () => void;
  params?: ItemStockModel;
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
        header={params ? 'Update Stock' : 'Add Stock'}
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
                  item: { label: i.item.name, value: i.item.id },
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
              items: items.map(({ item, ...i }) => ({ ...i, id: item.value })),
            };

            if (params) {
              updateItemStockService(_data, params.id)
                .then(() => {
                  toast.success('Updated stock');
                  setShow(false);
                  mutate?.();
                })
                .catch((error) => setErrors(error?.fields || {}))
                .finally(() => setSubmitting(false));
            }

            if (!params) {
              createItemStockService(_data)
                .then(() => {
                  toast.success('Added stock');
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
              <div className="p-6 max-h-[600px] overflow-y-auto">
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
                            <div key={key}>
                              <div className="grid md:grid-cols-[280px_repeat(3,minmax(0,1fr))_3rem] gap-4 mb-2">
                                <Field.Group
                                  label="Item"
                                  wrapperClassName="!mb-0"
                                  name={`items.${key}.item.label`}
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
                                {!!key && (
                                  <Button
                                    type="button"
                                    className="mt-6"
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
                  {params ? 'Update stock' : 'Add stock'}
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
