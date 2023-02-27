import { useState } from 'react';
import { DeleteIcon, PlusIcon, SaveIcon } from '@healthcare/icons';
import { FieldArray, Form, Formik } from 'formik';
import { Modal, Field, Button } from '@healthcareos/react';
import { helpers, schema } from '@healthcare/utils';
import { object } from 'yup';

export interface AddProps {
  children: (props: { proceed: () => void }) => void;
}

function Add({ children }: AddProps) {
  /**
   * state
   */
  const [state, setState] = useState(false);

  return (
    <>
      {children({ proceed: () => setState(true) })}
      <Modal
        size="xl"
        show={state}
        onHide={() => setState(false)}
        header="Create invoice"
      >
        <Formik
          validateOnMount
          validationSchema={object({
            items: schema.requireArray('Items').of(
              object().shape({
                item: schema.requireString('Item'),
                department: schema.requireString('Department'),
                quantity: schema.requireNumber('Quantity'),
                price: schema.requireNumber('Price'),
              })
            ),
          })}
          initialValues={{
            items: [{ item: '', department: '', quantity: '', price: '' }],
          }}
          onSubmit={(params) => {
            console.log(params);
          }}
        >
          {({
            values,
            isValid,
            isSubmitting,
            handleSubmit,
            setFieldValue,
            setFieldTouched,
          }) => (
            <Form>
              <div className="p-6">
                <FieldArray name="items">
                  {(helper) => (
                    <>
                      <div className="grid gap-4">
                        {values.items.map((item, key) => (
                          <div
                            key={key}
                            className={helpers.classNames(
                              'grid gap-2 md:grid-cols-[minmax(0,1fr),3rem]'
                            )}
                          >
                            <div
                              className={helpers.classNames(
                                'grid gap-4 md:grid md:grid-cols-2'
                              )}
                            >
                              <div className="grid gap-4 grid-cols-2">
                                <Field.Group
                                  label="Item"
                                  name={`items.${key}.item`}
                                  wrapperClassName="!mb-0"
                                >
                                  <Field.Select
                                    value={item.item}
                                    name={`items.${key}.item`}
                                    onChange={({ value }: { value: string }) =>
                                      setFieldValue(`items.${key}.item`, value)
                                    }
                                    options={[
                                      {
                                        label: 'Registration',
                                        value: 'registration',
                                      },
                                    ]}
                                  />
                                </Field.Group>
                                <Field.Group
                                  label="Revenue dept"
                                  name={`items.${key}.department`}
                                  wrapperClassName="!mb-0"
                                >
                                  <Field.Select
                                    value={item.department}
                                    name={`items.${key}.department`}
                                    onChange={({ value }: { value: string }) =>
                                      setFieldValue(
                                        `items.${key}.department`,
                                        value
                                      )
                                    }
                                    options={[
                                      {
                                        label: 'Pharmacy',
                                        value: 'pharmacy',
                                      },
                                    ]}
                                  />
                                </Field.Group>
                              </div>
                              <div className="grid gap-4 md:grid-cols-2">
                                <Field.Group
                                  label="Quantity"
                                  wrapperClassName="!mb-0"
                                  name={`items.${key}.quantity`}
                                >
                                  <Field.Input
                                    type="number"
                                    name={`items.${key}.quantity`}
                                    value={item.quantity}
                                  />
                                </Field.Group>

                                <Field.Group
                                  label="Price"
                                  wrapperClassName="!mb-0"
                                  name={`items.${key}.price`}
                                >
                                  <Field.Input
                                    type="number"
                                    value={item.price}
                                    name={`items.${key}.price`}
                                  />
                                </Field.Group>
                              </div>
                            </div>
                            {key !== 0 && (
                              <Button
                                className="text-red-600 mt-6"
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
                        className="btn-light mt-2"
                        onClick={() =>
                          helper.push({
                            item: '',
                            department: '',
                            quantity: '',
                            price: '',
                          })
                        }
                      >
                        <PlusIcon className="stroke-[2.5px]" />
                        <span>Add item</span>
                      </Button>
                    </>
                  )}
                </FieldArray>
              </div>

              <div
                className={helpers.classNames(
                  'p-6 bg-gray-50',
                  'md:flex md:flex-col md:gap-4',
                  'lg:flex lg:flex-row lg:items-center lg:justify-between'
                )}
              >
                <div className="flex gap-4 flex-col md:flex-row md:gap-6">
                  <p>Total: Ghs 50.00</p>
                  <p>Insurance: Ghs 20.00</p>
                  <p className="font-bold">Balance: Ghs 30.00</p>
                </div>
                <div className="flex gap-4">
                  <Button
                    type="submit"
                    disabled={!isValid}
                    className="btn btn-primary"
                    onClick={() => handleSubmit()}
                    {...{ isSubmitting }}
                  >
                    Finalize invoice
                  </Button>
                  <Button type="button" className="btn-outline">
                    <SaveIcon strokeWidth={1.5} />
                    <span>Save as draft</span>
                  </Button>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </Modal>
    </>
  );
}

export default Add;
