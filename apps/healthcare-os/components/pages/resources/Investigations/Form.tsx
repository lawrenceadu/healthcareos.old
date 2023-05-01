import { ReactElement, useState } from 'react';
import { Form as BaseForm, Formik, FieldArray } from 'formik';
import { Button, Field, Modal } from '@healthcareos/react';
import { array, bool, object } from 'yup';
import { AddIcon, DeleteIcon } from '@healthcare/icons';
import { schema } from '@healthcare/utils';
import { toast } from 'react-toastify';

import { InvestigationModel } from '../../../../models';
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
            params: array().of(
              object().shape({
                name: schema.requireString('Name'),
                type: schema.requireString('Type'),
                unit: schema.requireString('Unit', false),
                required: bool(),
                options: array().of(
                  object().shape({
                    label: schema.requireString('Label'),
                    value: schema.requireString('Value'),
                  })
                ),
              })
            ),
          })}
          initialValues={{
            name: params?.name || '',
            code: params?.code || '',
            description: params?.description || '',
            parameters: params?.parameters || [
              { name: '', type: '', unit: '', required: true, options: [] },
            ],
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
          {({ values, isValid, isSubmitting, setFieldValue }) => (
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

                <div>
                  <p className="font-medium mb-3">Results parameters</p>

                  <FieldArray name="parameters">
                    {(helper) => (
                      <div className="grid gap-4">
                        {values.parameters.map((param, key) => (
                          <div
                            key={key}
                            className="pb-4 border-b border-gray-200"
                          >
                            <div className="grid gap-4 md:grid-cols-[repeat(4,minmax(0,1fr))_3rem]">
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
                                      ['select', 'multi-select'].includes(value)
                                    ) {
                                      setFieldValue(
                                        `parameters.${key}.options`,
                                        [{ label: '', value: '' }]
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
                                <Field.Input name={`parameters.${key}.unit`} />
                              </Field.Group>

                              <div>
                                <Field.Toggle
                                  className="gap-4 mt-9 mx-auto"
                                  name={`parameters.${key}.required`}
                                  checked={param.required}
                                  onChange={(checked) =>
                                    setFieldValue(
                                      `parameters.${key}.required`,
                                      checked
                                    )
                                  }
                                >
                                  <span>Required</span>
                                </Field.Toggle>
                              </div>

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
                            {['select', 'multi-select'].includes(
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
                                          label="Label"
                                          wrapperClassName="!mb-0"
                                          name={`parameters.${key}.options.${index}.label`}
                                        >
                                          <Field.Input
                                            name={`parameters.${key}.options.${index}.label`}
                                          />
                                        </Field.Group>
                                        <Field.Group
                                          label="Value"
                                          wrapperClassName="!mb-0"
                                          name={`parameters.${key}.options.${index}.value`}
                                        >
                                          <Field.Input
                                            name={`parameters.${key}.options.${index}.value`}
                                          />
                                        </Field.Group>
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
                                          helper.push({ label: '', value: '' })
                                        }
                                      >
                                        <AddIcon size={18} />
                                        <span>Add Options</span>
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
