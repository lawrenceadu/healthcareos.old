import { ReactElement, useState } from 'react';
import { Form as BaseForm, FieldArray, Formik } from 'formik';
import { Button, Field, Modal } from '@healthcareos/react';
import { DeleteIcon, PlusIcon } from '@healthcare/icons';
import { schema } from '@healthcare/utils';
import { object } from 'yup';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';

import { ItemIssueModel } from '../../../../../models';
import * as api from '../../../../../services/inventory';
import SearchSelect from '../../../../libs/SearchSelect';

export interface FormProps {
  mutate: () => void;
  params?: ItemIssueModel;
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
        header={!params ? 'Add request' : 'Update request'}
      >
        <Formik
          validateOnMount
          enableReinitialize
          validationSchema={object({
            issue_to: schema.requireString('Issue to'),
            recipient: object().shape({
              label: schema.requireString('Recipient'),
              value: schema.requireString('Value'),
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
            issue_to: params?.issue_to || '',
            recipient: params?.recipient
              ? { label: params.recipient.name, value: params.recipient.id }
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
            { recipient, items, ...data },
            { setSubmitting, setErrors }
          ) => {
            const _data = {
              ...data,
              recipient: recipient.value,
              items: items.map((i) => ({
                id: i.item.value,
                quantity: i.quantity,
              })),
            };

            if (params) {
              api
                .updateItemRequestService(_data, params.id)
                .then(() => {
                  toast.success('Updated request');
                  setShow(false);
                  mutate?.();
                })
                .catch((error) => setErrors(error?.fields || {}))
                .finally(() => setSubmitting(false));
            }

            if (!params) {
              api
                .createItemRequestService(_data)
                .then(() => {
                  toast.success('Request made');
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
            handleSubmit,
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
                  <Field.Group
                    name="issue_to"
                    label="Issue To"
                    wrapperClassName="!mb-0"
                  >
                    <Field.Select
                      name="issue_to"
                      value={values.issue_to}
                      onChange={({ value }: { value: string }) => {
                        setFieldValue('issue_to', value);
                        setFieldValue('recipient', { label: '', value: '' });
                      }}
                      options={[
                        { label: 'Department', value: 'department' },
                        { label: 'Location', value: 'location' },
                        { label: 'User', value: 'user' },
                      ]}
                    />
                  </Field.Group>

                  <Field.Group
                    name="recipient.label"
                    label="Recipient"
                    wrapperClassName="!mb-0"
                  >
                    {values.issue_to === 'department' && (
                      <SearchSelect.Departments
                        value={values.recipient}
                        onChange={(value) => setFieldValue('recipient', value)}
                      />
                    )}

                    {values.issue_to === 'location' && (
                      <SearchSelect.Locations
                        value={values.recipient}
                        onChange={(value) => setFieldValue('recipient', value)}
                      />
                    )}

                    {values.issue_to === 'user' && (
                      <SearchSelect.Users
                        value={values.recipient}
                        onChange={(value) => setFieldValue('recipient', value)}
                      />
                    )}
                  </Field.Group>
                </div>

                <Field.Group name="date" label="Date">
                  <Field.Date
                    name="date"
                    value={values.date}
                    options={{ minDate: dayjs().add(8, 'hour').toDate() }}
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
                  {params ? 'Update' : 'Request'}
                </Button>
              </div>
            </BaseForm>
          )}
        </Formik>
      </Modal>
    </>
  );
}
