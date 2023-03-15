import { Button, Field } from '@healthcareos/react';
import { Form, Formik } from 'formik';
import { schema } from '@healthcare/utils';
import { object } from 'yup';
import { toast } from 'react-toastify';

import { addAllergyService } from '../../../../services/patient';
import { usePatient } from '../../../../hooks';

// eslint-disable-next-line
export interface AddProps {}

export function Add({
  onHide,
  setTab,
}: {
  onHide: () => void;
  setTab: (key: string) => void;
}) {
  /**
   * hook
   */
  const { patient, updateHistory } = usePatient();

  return (
    <Formik
      validateOnMount
      validationSchema={object({
        substance: schema.requireString('Substance'),
        severity_of_reaction: schema.requireString('Result'),
        symptoms: schema.requireString('Symptoms'),
        notes: schema.requireString('Notes'),
      })}
      initialValues={{
        substance: '',
        severity_of_reaction: '',
        symptoms: '',
        notes: '',
      }}
      onSubmit={(params, { setSubmitting, setErrors }) => {
        addAllergyService({ ...params, patient: patient.id })
          .then(() => {
            toast.success('Allergy added');
            updateHistory();
            setTab('index');
          })
          .catch((error) => setErrors(error?.fields || {}))
          .finally(() => setSubmitting(false));
      }}
    >
      {({ values, isValid, isSubmitting, handleSubmit }) => (
        <Form>
          <div className="px-6 mb-10">
            <Field.Group name="substance" label="Substance">
              <Field.Input name="substance" value={values.substance} />
            </Field.Group>

            <div className="mb-6">
              <p className="mb-4">Severity of reaction</p>
              <div className="flex gap-6">
                <Field.Radio name="severity_of_reaction" value="mild">
                  Mild
                </Field.Radio>
                <Field.Radio name="severity_of_reaction" value="moderate">
                  Moderate
                </Field.Radio>
                <Field.Radio name="severity_of_reaction" value="severe">
                  Severe
                </Field.Radio>
              </div>
            </div>

            <Field.Group name="symptoms" label="Symptoms">
              <Field.Input name="symptoms" value={values.symptoms} />
            </Field.Group>

            <Field.Group name="notes" label="Notes">
              <Field.Input
                as="textarea"
                className="py-4"
                name="notes"
                value={values.notes}
              />
            </Field.Group>
          </div>

          <div className="flex gap-6 justify-end py-3 px-6 border-t border-gray-200">
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
              Add allergy
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}

export default Add;
