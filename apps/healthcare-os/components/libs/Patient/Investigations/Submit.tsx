import { Fragment, ReactElement, useState } from 'react';
import { Button, Field, FileUpload, Modal } from '@healthcareos/react';
import { FieldArray, Form, Formik } from 'formik';
import { DeleteIcon, PlusIcon } from '@healthcare/icons';
import { helpers, schema } from '@healthcare/utils';
import { object } from 'yup';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';

import { submitInvestigationResultService } from '../../../../services/investigation';
import { InvestigationRequestModel } from '../../../../models';

// eslint-disable-next-line
export interface SubmitProps {
  children: (props: { proceed: () => void }) => ReactElement;
  investigation: InvestigationRequestModel;
  mutate: () => void;
}

export function Submit({
  investigation,
  children,
  mutate,
  ...props
}: SubmitProps) {
  /**
   * state
   */
  const [show, setShow] = useState(false);

  /**
   * variables
   */
  const parameters = investigation.investigation.parameters;

  const items = [
    { label: 'Investigation', value: investigation.investigation.name },
    {
      label: 'Expected date',
      value: investigation.expected_date
        ? dayjs(investigation.expected_date).format('DD/MM/YYYY')
        : '',
    },
    { label: 'Notes', value: investigation.notes },
    {
      label: 'Requested By',
      value: investigation.created_by.name,
    },
    {
      label: 'Requested at',
      value: dayjs(investigation.created_at).format('DD/MM/YYYY'),
    },
  ];

  return (
    <>
      {children({ proceed: () => setShow(true) })}

      <Modal show={show} onHide={() => setShow(false)} header="Submit Results">
        <>
          <div className="px-6 pt-6">
            <div className="border border-gray-200 rounded-lg bg-neutral-100 p-4 flex flex-col gap-1">
              {items.map((item, key) => (
                <Fragment key={key}>
                  {item.value && (
                    <div className="grid grid-cols-[104px_minmax(0,1fr)] gap-4 items-center">
                      <small>{item.label}:</small>
                      <p>{item.value}</p>
                    </div>
                  )}
                </Fragment>
              ))}
            </div>
          </div>

          <Formik
            validateOnMount
            enableReinitialize
            validationSchema={object({
              results: schema.requireArray('Results', false).of(
                object().shape({
                  label: schema.requireString('Label', false),
                  // value: lazy((value) =>
                  //   Array.isArray(value) ? array().of(string()) : string()
                  // ),
                })
              ),
              report: schema.requireString('Report'),
              notes: schema.requireString('Notes', false),
              attachemt: schema.requireFile({
                size: 10,
                required: false,
                field: 'Attachment',
                type: ['image', 'pdf'],
              }),
            })}
            initialValues={{
              results: parameters?.map((i) => ({
                label: i.name,
                value:
                  i.type === 'text'
                    ? ''
                    : i.type === 'group'
                    ? i.options?.map((i) => ({ label: i.label, value: '' }))
                    : [],
              })) || [{ label: '', value: '' }],
              report: '',
              notes: '',
              attachment: {} as File,
            }}
            onSubmit={({ results, ...params }, { setSubmitting }) => {
              const formData = new FormData();

              Object.keys(params).map((key) =>
                formData.append(key, params[key])
              );

              results.map((r, key) => {
                formData.append(`results[${key}][label]`, r.label);
                formData.append(
                  `results[${key}][value]`,
                  Array.isArray(r.value) ? JSON.stringify(r.value) : r.value
                );
              });

              submitInvestigationResultService(formData, investigation.id)
                .then(() => {
                  toast.success('Investigation added');
                  setShow(false);
                  mutate();
                })
                .catch(() => null)
                .finally(() => setSubmitting(false));
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
                  <div className="mb-6">
                    <p className="mb-4 font-medium">Results</p>
                    <FieldArray name="results">
                      {(helper) => (
                        <div className="grid gap-4 pb-4 border-b border-neutral-200">
                          {values.results.map((i, key) => (
                            <div key={key} className="grid gap-6">
                              {!parameters?.[key] && (
                                <div
                                  key={key}
                                  className="grid grid-cols-[repeat(2,minmax(0,1fr)),3rem] gap-6"
                                >
                                  <Field.Group
                                    label="Label"
                                    wrapperClassName="!mb-0"
                                    name={`results.${key}.label`}
                                  >
                                    <Field.Input
                                      value={i.label}
                                      name={`results.${key}.label`}
                                    />
                                  </Field.Group>

                                  <Field.Group
                                    label="Result"
                                    wrapperClassName="!mb-0"
                                    name={`results.${key}.value`}
                                  >
                                    <Field.Input
                                      value={i.value}
                                      name={`results.${key}.value`}
                                    />
                                  </Field.Group>
                                  {key !== 0 && (
                                    <Button
                                      type="button"
                                      className="mt-6 !px-0 w-full"
                                      onClick={() => helper.remove(key)}
                                    >
                                      <DeleteIcon />
                                    </Button>
                                  )}
                                </div>
                              )}

                              {parameters?.[key] && (
                                <>
                                  {/* non group result capture */}
                                  {['text', 'select', 'multi-select'].includes(
                                    parameters[key]?.type
                                  ) && (
                                    <>
                                      <Field.Group
                                        label={i.label}
                                        wrapperClassName="!mb-0"
                                        name={`results.${key}.value`}
                                      >
                                        {parameters[key]?.type === 'text' && (
                                          <Field.Input
                                            name={`results.${key}.value`}
                                            {...(parameters[key]?.unit && {
                                              value: (
                                                i.value as string
                                              ).replace(
                                                parameters[key].unit,
                                                ''
                                              ),
                                              onChange: ({
                                                currentTarget: { value },
                                              }) => {
                                                setFieldValue(
                                                  `results.${key}.value`,
                                                  `${value}${parameters[key].unit}`
                                                );
                                              },
                                            })}
                                          />
                                        )}

                                        {parameters[key]?.type === 'select' && (
                                          <Field.Select
                                            value={i.value}
                                            onChange={({
                                              value,
                                            }: {
                                              value: string;
                                            }) =>
                                              setFieldValue(
                                                `results.${key}.value`,
                                                value
                                              )
                                            }
                                            options={parameters[key].options}
                                          />
                                        )}

                                        {parameters[key]?.type ===
                                          'multi-select' && (
                                          <Field.Select
                                            isMulti
                                            value={i.value}
                                            onChange={(i) =>
                                              setFieldValue(
                                                `results.${key}.value`,
                                                i.map((i) => i.value)
                                              )
                                            }
                                            options={parameters[key].options}
                                          />
                                        )}

                                        {parameters[key]?.unit && (
                                          <span className="block px-4 whitespace-nowrap">
                                            {parameters[key].unit}
                                          </span>
                                        )}
                                      </Field.Group>
                                    </>
                                  )}

                                  {/* for groups */}
                                  {['group'].includes(
                                    parameters[key]?.type
                                  ) && (
                                    <>
                                      <div>
                                        <p className="text-sm mb-2">
                                          {parameters[key]?.name}
                                        </p>
                                        <div
                                          className={helpers.classNames(
                                            'p-4',
                                            'grid grid-cols-1 gap-4',
                                            'rounded-lg border border-neutral-200'
                                          )}
                                        >
                                          {parameters[key]?.options?.map(
                                            (item, _key) => (
                                              <Field.Group
                                                key={_key}
                                                label={item.label}
                                                wrapperClassName="!mb-0"
                                                name={`results.${key}.value.${_key}.value`}
                                              >
                                                <Field.Input
                                                  name={`results.${key}.value.${_key}.value`}
                                                  {...(item?.unit && {
                                                    value: (
                                                      (i.value[_key] as any)
                                                        .value as string
                                                    ).replace(item.unit, ''),
                                                    onChange: ({
                                                      currentTarget: { value },
                                                    }) => {
                                                      setFieldValue(
                                                        `results.${key}.value.${_key}.value`,
                                                        `${value}${item.unit}`
                                                      );
                                                    },
                                                  })}
                                                />

                                                {item?.unit && (
                                                  <span className="block px-4 whitespace-nowrap">
                                                    {item.unit}
                                                  </span>
                                                )}
                                              </Field.Group>
                                            )
                                          )}
                                        </div>
                                      </div>
                                    </>
                                  )}
                                </>
                              )}
                            </div>
                          ))}
                          <div>
                            <Button
                              type="button"
                              className="btn-light"
                              onClick={() =>
                                helper.push({ label: '', result: '' })
                              }
                            >
                              <PlusIcon />
                              <span>Add another</span>
                            </Button>
                          </div>
                        </div>
                      )}
                    </FieldArray>
                  </div>

                  <Field.Group name="report" label="Report">
                    <Field.Input
                      as="textarea"
                      name="report"
                      className="py-4"
                      value={values.report}
                    />
                  </Field.Group>

                  <Field.Group name="notes" label="Notes">
                    <Field.Input
                      as="textarea"
                      className="py-4"
                      name="notes"
                      value={values.notes}
                    />
                  </Field.Group>

                  <Field.Group name="attachment" label="Attachment">
                    <FileUpload
                      accept="image/*,.pdf"
                      name="attachment"
                      value={values.attachment}
                      {...{ setFieldValue, setFieldTouched }}
                    >
                      {values.attachment?.name}
                    </FileUpload>
                  </Field.Group>
                </div>

                <div className="px-6 py-3 border-t border-gray-200 flex gap-6 justify-end sticky bottom-0 bg-white">
                  <Button
                    type="submit"
                    disabled={!isValid}
                    className="btn btn-primary"
                    onClick={() => handleSubmit()}
                    {...{ isSubmitting }}
                  >
                    Submit results
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </>
      </Modal>
    </>
  );
}

export default Submit;
