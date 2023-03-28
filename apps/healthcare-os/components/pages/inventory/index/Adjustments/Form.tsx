import { ReactElement, useState } from 'react';
import { Form as BaseForm, FieldArray, Formik } from 'formik';
import { Button, Dropdown, Field, Modal } from '@healthcareos/react';
import { ChevronDownIcon, DeleteIcon, PlusIcon } from '@healthcare/icons';
import { startCase } from 'lodash';
import { schema } from '@healthcare/utils';
import { object } from 'yup';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';

import { createItemAdjustmentService, updateItemAdjustmentService } from '../../../../../services/inventory'; // prettier-ignore
import { ItemAdjustmentModel } from '../../../../../models';
import { useLocations } from '../../../../../hooks';
import SearchSelect from '../../../../libs/SearchSelect';

export interface FormInterface {
  mutate?: () => void;
  params?: ItemAdjustmentModel;
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
        size="lg"
        show={show}
        onHide={() => setShow(false)}
        header={params ? 'Update adjustment' : 'Add adjustment'}
      >
        <Formik
          validateOnMount
          validationSchema={object({
            items: schema.requireArray('Item').of(
              object().shape({
                item: object().shape({
                  label: schema.requireString('Label'),
                  value: schema.requireString('Value'),
                }),
                quantity: schema.requireNumber('Quantity'),
                type: schema.requireString('Type'),
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
            items: params?.details
              ? params.details.map((i) => ({
                  item: { label: i.item.name, value: i.item.id },
                  quantity: Math.abs(i.quantity),
                  type: i.quantity < 0 ? 'reduction' : 'addition',
                }))
              : [
                  {
                    item: { label: '', value: '' },
                    quantity: '',
                    type: 'addition',
                  },
                ],
            notes: params?.notes || '',
            reason: params?.reason || '',
            location: params?.location?.id || '',
            date: params?.date || '',
          }}
          onSubmit={({ items, ...data }, { setSubmitting, setErrors }) => {
            const _data = {
              ...data,
              items: items.map(({ item, type, quantity }) => ({
                id: item.value,
                quantity: (type === 'reduction' ? -1 : 1) * Math.abs(quantity),
              })),
            };

            (() => {
              if (params) {
                return updateItemAdjustmentService(_data, params.id).then(
                  () => {
                    toast.success('Updated adjustment');
                    setShow(false);
                    mutate?.();
                  }
                );
              }

              if (!params) {
                return createItemAdjustmentService(_data).then(() => {
                  toast.success('Added adjustment');
                  setShow(false);
                  mutate?.();
                });
              }
            })()
              .catch((error) => {
                if (error?.fields) {
                  setErrors(error?.fields || {});
                }

                if (error?.message) {
                  toast.error(error.message);
                }
              })
              .finally(() => setSubmitting(false));
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
                <div className="mb-6">
                  <p className="mb-4 font-medium">Items</p>

                  <FieldArray name="items">
                    {(helper) => (
                      <>
                        <div className="grid gap-4 mb-4">
                          {values.items.map((item, key) => (
                            <div key={key}>
                              <div className="grid md:grid-cols-[repeat(2,minmax(0,1fr))_3rem] gap-4">
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
                                  containerClassName="overflow"
                                >
                                  <Field.Input
                                    type="number"
                                    name={`items.${key}.quantity`}
                                    value={item.quantity}
                                  />
                                  <Dropdown>
                                    <Dropdown.Toggle
                                      type="button"
                                      className="px-2 border-l border-gray-200"
                                    >
                                      <small>{startCase(item.type)}</small>
                                      <ChevronDownIcon size={16} />
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                      {['addition', 'reduction'].map(
                                        (i, index) => (
                                          <Dropdown.Item
                                            key={index}
                                            active={i === item.type}
                                            onClick={() =>
                                              setFieldValue(
                                                `items.${key}.type`,
                                                i
                                              )
                                            }
                                          >
                                            {startCase(i)}
                                          </Dropdown.Item>
                                        )
                                      )}
                                    </Dropdown.Menu>
                                  </Dropdown>
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
