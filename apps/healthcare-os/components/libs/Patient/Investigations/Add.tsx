import { Dispatch, SetStateAction } from 'react';
import { Form, Formik, FieldArray } from 'formik';
import { AddIcon, DeleteIcon } from '@healthcare/icons';
import { helpers, schema } from '@healthcare/utils';
import { Button, Field } from '@healthcareos/react';
import { object } from 'yup';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';

import { requestInvestigationService } from '../../../../services/patient';
import { usePatient } from '../../../../hooks';
import SearchSelect from '../../SearchSelect';

export interface AddProps {
  onHide: () => void;
  setTab: Dispatch<SetStateAction<string>>;
}

export function Add({ onHide, setTab }: AddProps) {
  /**
   * hooks
   */
  const { patient } = usePatient();

  return (
    <Formik
      validateOnMount
      enableReinitialize
      validationSchema={object({
        investigations: schema.requireArray('Investigations').of(
          object().shape({
            investigation: object().shape({
              label: schema.requireString('Label'),
              value: schema.requireString('Value'),
            }),
            expected_date: schema.requireString('Expected date', false),
            notes: schema.requireString('Notes', false),
          })
        ),
      })}
      initialValues={{
        investigations: [
          {
            investigation: { label: '', value: '' },
            expected_date: '',
            notes: '',
          },
        ],
      }}
      onSubmit={(
        { investigations, ...params },
        { setSubmitting, setErrors, resetForm }
      ) => {
        requestInvestigationService({
          investigations: investigations.map(({ investigation, ...rest }) => ({
            ...rest,
            id: investigation.value,
          })),
          patient: patient.id,
        })
          .then(() => {
            toast.success('Investigation added');
            resetForm({});
          })
          .catch((error) =>
            toast.error(error?.message || 'Unable to request for investigation')
          )
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
          <div
            className={helpers.classNames(
              'px-6 mb-6',
              'divide-y divide-neutral-200'
            )}
          >
            <FieldArray name="investigations">
              {(helper) => (
                <>
                  {values.investigations.map((item, key) => (
                    <div
                      key={key}
                      className={helpers.classNames(
                        'py-6',
                        !key ? '' : 'grid gap-4 grid-cols-[minmax(0,1fr)_3rem]'
                      )}
                    >
                      <div>
                        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2 mb-6">
                          <Field.Group
                            wrapperClassName="!mb-0"
                            label="Find investigation"
                            name={`investigations.${key}.investigation.value`}
                          >
                            <SearchSelect.Investigations
                              value={item.investigation}
                              onChange={(value) =>
                                setFieldValue(
                                  `investigations.${key}.investigation`,
                                  value
                                )
                              }
                            />
                          </Field.Group>
                          <Field.Group
                            label="Expected date"
                            wrapperClassName="!mb-0"
                            name={`investigations.${key}.expected_date`}
                          >
                            <Field.Date
                              value={item.expected_date}
                              name={`investigations.${key}.expected_date`}
                              options={{
                                enableTime: true,
                                minDate: dayjs().startOf('day').toDate(),
                              }}
                              {...{ setFieldValue, setFieldTouched }}
                            />
                          </Field.Group>
                        </div>

                        <Field.Group
                          label="Notes"
                          name={`investigations.${key}.notes`}
                        >
                          <Field.Input
                            as="textarea"
                            className="py-4"
                            value={item.notes}
                            name={`investigations.${key}.notes`}
                          />
                        </Field.Group>
                      </div>

                      {key !== 0 && (
                        <Button
                          type="button"
                          aria-label="Remove"
                          className="!p-0 mt-6"
                          onClick={() => helper.remove(key)}
                        >
                          <DeleteIcon />
                        </Button>
                      )}
                    </div>
                  ))}

                  <Button
                    type="button"
                    className="btn-light"
                    onClick={() =>
                      helper.push({
                        investigation: { label: '', value: '' },
                        expected_date: '',
                        notes: '',
                      })
                    }
                  >
                    <AddIcon />
                    <span>Add request</span>
                  </Button>
                </>
              )}
            </FieldArray>
          </div>

          <div className="px-6 py-3 border-t border-gray-200 flex gap-6 justify-end">
            <Button
              type="button"
              className="btn-light"
              onClick={() => onHide()}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!isValid}
              className="btn btn-primary"
              onClick={() => handleSubmit()}
              {...{ isSubmitting }}
            >
              Add investigation
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}

export default Add;
