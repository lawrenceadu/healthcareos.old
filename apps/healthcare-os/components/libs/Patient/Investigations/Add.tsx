import { Dispatch, SetStateAction } from 'react';
import { Button, Field } from '@healthcareos/react';
import { Form, Formik } from 'formik';
import { object } from 'yup';
import { schema } from '@healthcare/utils';
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
      validationSchema={object({
        investigation: object().shape({
          label: schema.requireString('Label'),
          value: schema.requireString('Value'),
        }),
        expected_date: schema.requireString('Expected date', false),
        notes: schema.requireString('Notes', false),
      })}
      initialValues={{
        investigation: { label: '', value: '' },
        expected_date: '',
        notes: '',
      }}
      onSubmit={(
        { investigation, ...params },
        { setSubmitting, setErrors, resetForm }
      ) => {
        const data = { ...params, investigation: investigation.value };

        requestInvestigationService({
          ...data,
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
          <div className="px-6 pb-6">
            <div className="grid gap-6 lg:grid-cols-2 mb-6">
              <Field.Group
                name="investigation"
                wrapperClassName="!mb-0"
                label="Find investigation"
              >
                <SearchSelect.Investigations
                  value={values.investigation}
                  onChange={(value) => setFieldValue('investigation', value)}
                />
              </Field.Group>

              <Field.Group
                name="expected_date"
                label="Expected date"
                wrapperClassName="!mb-0"
              >
                <Field.Date
                  name="expected_date"
                  value={values.expected_date}
                  options={{
                    minDate: dayjs().startOf('day').toDate(),
                  }}
                  {...{ setFieldValue, setFieldTouched }}
                />
              </Field.Group>
            </div>

            <Field.Group name="notes" label="Notes">
              <Field.Input
                as="textarea"
                className="py-4"
                name="notes"
                value={values.notes}
              />
            </Field.Group>
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
