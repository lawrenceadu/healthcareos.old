import { ReactElement, useState } from 'react';
import { Form as BaseForm, Formik, FieldArray } from 'formik';
import { Button, Field, Modal } from '@healthcareos/react';
import { array, bool, object } from 'yup';
import { AddIcon, DeleteIcon } from '@healthcare/icons';
import { schema } from '@healthcare/utils';
import { toast } from 'react-toastify';

import { InvestigationModel } from '../../../../models';
import { useStore } from '../../../../hooks';
import * as api from '../../../../services/resource';

export interface FormProps {
  mutate: () => void;
  params?: InvestigationModel;
  children: (props: { proceed: () => void }) => ReactElement;
}

function Form({ mutate, children, params }: FormProps) {
  /**
   * state
   */
  const [show, setShow] = useState(false);

  /**
   * store
   */
  const { store } = useStore();

  /**
   * variables
   */
  const currency = store?.facility?.currency_symbol;

  return (
    <>
      {children({ proceed: () => setShow(true) })}

      <Modal
        size="lg"
        show={show}
        onHide={() => setShow(false)}
        header={params ? 'Update investigation' : 'Add investigation'}
      >
        <Formik
          validateOnMount
          enableReinitialize
          validationSchema={object({
            name: schema.requireString('Name'),
            code: schema.requireString('Type'),
            description: schema.requireString('Description'),
            parameters: array().of(
              object().shape({
                name: schema.requireString('Name'),
                type: schema.requireString('Type'),
                unit: schema.requireString('Unit', false).nullable(),
                required: bool().nullable(),
                options: array().nullable(),
              })
            ),
            regular_price: schema.requireNumber('Regular price'),
            private_price: schema.requireNumber('Private insurance price'),
            nhis_price: schema.requireNumber('NHIS price'),
          })}
          initialValues={{
            name: params?.name || '',
            code: params?.code || '',
            description: params?.description || '',
            parameters: params?.parameters || [
              { name: '', type: '', unit: '', required: true, options: [] },
            ],
            nhis_price: params?.nhis_price || '',
            regular_price: params?.regular_price || '',
            private_price: params?.private_price || '',
          }}
          onSubmit={(data, { setSubmitting, setErrors }) => {
            if (params) {
              api
                .updateInvestigationService(data, params.id)
                .then(() => {
                  toast.success('Investigation updated');
                  setShow(false);
                  mutate();
                })
                .catch((error) => setErrors(error?.fields || {}))
                .finally(() => setSubmitting(false));
            }

            if (!params) {
              api
                .addInvestigationService(data)
                .then(() => {
                  toast.success('Investigation added');
                  setShow(false);
                  mutate();
                })
                .catch((error) => setErrors(error?.fields || {}))
                .finally(() => setSubmitting(false));
            }
          }}
        >
          {({ errors, values, isValid, isSubmitting, setFieldValue }) => (
            <BaseForm>
              <div className="p-6">
                <Field.Group name="name" label="Name">
                  <Field.Input name="name" />
                </Field.Group>

                <Field.Group name="code" label="Code">
                  <Field.Input name="code" />
                </Field.Group>

                <Field.Group name="description" label="Description">
                  <Field.Input
                    as="textarea"
                    name="description"
                    className="py-4"
                  />
                </Field.Group>

                <div className="mb-6">
                  <p className="font-medium mb-3">Results parameters</p>

                  <FieldArray name="parameters">
                    {(helper) => (
                      <div className="grid gap-4">
                        {values.parameters.map((param, key) => (
                          <div
                            key={key}
                            className="pb-4 border-b border-gray-200"
                          >
                            <div className="grid gap-4 md:grid-cols-[repeat(3,minmax(0,1fr))_3rem]">
                              <Field.Group
                                label="Field name"
                                wrapperClassName="!mb-0"
                                name={`parameters.${key}.name`}
                              >
                                <Field.Input name={`parameters.${key}.name`} />
                              </Field.Group>
                              <Field.Group
                                label="Field type"
                                wrapperClassName="!mb-0"
                                name={`parameters.${key}.type`}
                              >
                                <Field.Select
                                  value={param.type}
                                  name={`parameters.${key}.type`}
                                  options={[
                                    { label: 'Textbox', value: 'text' },
                                    { label: 'Select', value: 'select' },
                                    {
                                      label: 'Multi-select',
                                      value: 'multi-select',
                                    },
                                    { label: 'Group', value: 'group' },
                                  ]}
                                  onChange={({ value }: { value: string }) => {
                                    setFieldValue(
                                      `parameters.${key}.type`,
                                      value
                                    );
                                    if (value === 'text') {
                                      setFieldValue(
                                        `parameters.${key}.options`,
                                        null
                                      );
                                    }

                                    if (
                                      [
                                        'group',
                                        'select',
                                        'multi-select',
                                      ].includes(value)
                                    ) {
                                      setFieldValue(
                                        `parameters.${key}.options`,
                                        [{ label: '' }]
                                      );
                                      setFieldValue(
                                        `parameters.${key}.unit`,
                                        ''
                                      );
                                    }
                                  }}
                                />
                              </Field.Group>
                              <Field.Group
                                label="Unit"
                                wrapperClassName="!mb-0"
                                name={`parameters.${key}.unit`}
                                disabled={param.type !== 'text'}
                              >
                                <Field.Input
                                  name={`parameters.${key}.unit`}
                                  value={param.unit || ''}
                                />
                              </Field.Group>

                              <div>
                                <Button
                                  type="button"
                                  className="!px-0 w-full mt-6"
                                  onClick={() => helper.remove(key)}
                                >
                                  <DeleteIcon />
                                </Button>
                              </div>
                            </div>

                            {['group', 'select', 'multi-select'].includes(
                              param.type
                            ) && (
                              <FieldArray name={`parameters.${key}.options`}>
                                {(helper) => (
                                  <div className="grid gap-4 mt-4">
                                    {param.options?.map((option, index) => (
                                      <div
                                        key={index}
                                        className="grid gap-4 grid-cols-3"
                                      >
                                        <Field.Group
                                          wrapperClassName="!mb-0"
                                          name={`parameters.${key}.options.${index}.label`}
                                          label={
                                            param.type === 'group'
                                              ? 'Sub field name'
                                              : 'Label'
                                          }
                                        >
                                          <Field.Input
                                            value={option.label || ''}
                                            name={`parameters.${key}.options.${index}.label`}
                                          />
                                        </Field.Group>

                                        {param.type !== 'group' && (
                                          <Field.Group
                                            label="Value"
                                            wrapperClassName="!mb-0"
                                            name={`parameters.${key}.options.${index}.value`}
                                          >
                                            <Field.Input
                                              value={option.value || ''}
                                              name={`parameters.${key}.options.${index}.value`}
                                            />
                                          </Field.Group>
                                        )}

                                        {param.type === 'group' && (
                                          <Field.Group
                                            label="Unit"
                                            wrapperClassName="!mb-0"
                                            name={`parameters.${key}.options.${index}.unit`}
                                          >
                                            <Field.Input
                                              value={option.unit || ''}
                                              name={`parameters.${key}.options.${index}.unit`}
                                            />
                                          </Field.Group>
                                        )}

                                        {!!index && (
                                          <div className="mt-6">
                                            <Button
                                              type="button"
                                              onClick={() =>
                                                helper.remove(index)
                                              }
                                            >
                                              <DeleteIcon />
                                            </Button>
                                          </div>
                                        )}
                                      </div>
                                    ))}
                                    <div>
                                      <Button
                                        type="button"
                                        className="btn-light !text-sm"
                                        onClick={() =>
                                          helper.push({ label: '' })
                                        }
                                      >
                                        <AddIcon size={18} />
                                        <span>
                                          {param.type === 'group'
                                            ? 'Add sub field'
                                            : 'Add Options'}
                                        </span>
                                      </Button>
                                    </div>
                                  </div>
                                )}
                              </FieldArray>
                            )}
                          </div>
                        ))}

                        <div>
                          <Button
                            type="button"
                            className="btn-light"
                            onClick={() => helper.push({})}
                          >
                            <AddIcon />
                            <span>Add result</span>
                          </Button>
                        </div>
                      </div>
                    )}
                  </FieldArray>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-4">
                  <Field.Group
                    name="regular_price"
                    label="Regular price"
                    wrapperClassName="!mb-0"
                    containerClassName="px-4"
                  >
                    <span>{currency}</span>
                    <Field.Input
                      name="regular_price"
                      type="number"
                      className="!px-0"
                    />
                  </Field.Group>

                  <Field.Group
                    name="nhis_price"
                    label="NHIS price"
                    wrapperClassName="!mb-0"
                    containerClassName="px-4"
                  >
                    <span>{currency}</span>
                    <Field.Input
                      name="nhis_price"
                      type="number"
                      className="!px-0"
                    />
                  </Field.Group>

                  <Field.Group
                    name="private_price"
                    label="Private insurance price"
                    wrapperClassName="!mb-0"
                    containerClassName="px-4"
                  >
                    <span>{currency}</span>
                    <Field.Input
                      type="number"
                      name="private_price"
                      className="!px-0"
                    />
                  </Field.Group>
                </div>
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
                  {params ? 'Update' : 'Add'} investigation
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
