import { FieldArray, Form as BaseForm, Formik } from 'formik';
import { AddIcon, DeleteIcon } from '@healthcare/icons';
import { Button, Field } from '@healthcareos/react';
import { object } from 'yup';
import { schema } from '@healthcare/utils';
import { toast } from 'react-toastify';

import { admitPatientService } from '../../../../services/admission';
import { AdmissionModel } from '../../../../models';
import { usePatient } from '../../../../hooks';
import SearchSelect from '../../SearchSelect';

export interface FormProps {
  button: string;
  type: 'detain' | 'admit';
  params?: AdmissionModel;
  onSuccess: () => void;
}

function Form({ button, type, params, onSuccess }: FormProps) {
  /**
   * context
   */
  const { patient, mutate, updateHistory } = usePatient();

  return (
    <Formik
      validateOnMount
      validationSchema={object({
        diagnosis: schema.requireArray('Diagnosis').of(
          object().shape({
            label: schema.requireString('Diagnosis'),
            value: schema.requireString('Diagnosis'),
          })
        ),
        ward: object().shape({
          label: schema.requireString('Ward'),
          value: schema.requireString('Ward'),
        }),
        department: object().shape({
          label: schema.requireString('Department'),
          value: schema.requireString('Department'),
        }),
        notes: schema.requireString('Notes'),
      })}
      initialValues={{
        diagnosis: [{ label: '', value: '' }],
        ward: { label: '', value: '' },
        department: { label: '', value: '' },
        notes: '',
        bed: '',
      }}
      onSubmit={(
        { diagnosis, ward, department, ...params },
        { setSubmitting, setErrors }
      ) => {
        admitPatientService({
          ...params,
          type,
          patient: patient.id,
          diagnosis: diagnosis.map((i) => i.value),
          ward: ward.value,
          department: department.value,
        })
          .then(() => {
            toast.success('Patient detained');
            updateHistory();
            mutate?.();

            onSuccess?.();
          })
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
        handleSubmit,
        setFieldValue,
        setFieldTouched,
      }) => (
        <BaseForm className="p-6">
          <div className="mb-6">
            <p className="text-sm mb-1">Diagnosis</p>

            <FieldArray name="diagnosis">
              {(helpers) => (
                <>
                  <div className="flex flex-col gap-4 mb-4">
                    {values.diagnosis.map((diagnose, key) => (
                      <Field.Group
                        key={key}
                        name={`diagnosis.${key}.label`}
                        wrapperClassName="!mb-0"
                      >
                        <SearchSelect.Diagnosis
                          value={diagnose}
                          onChange={(value) =>
                            setFieldValue(`diagnosis.${key}`, value)
                          }
                        />
                        {key !== 0 && (
                          <Button
                            type="button"
                            className="!py-0"
                            aria-label="Remove"
                            onClick={() => helpers.remove(key)}
                          >
                            <DeleteIcon />
                          </Button>
                        )}
                      </Field.Group>
                    ))}
                  </div>
                  <Button
                    type="button"
                    className="btn-light"
                    onClick={() => helpers.push('')}
                  >
                    <AddIcon />
                    <span>Add diagnosis</span>
                  </Button>
                </>
              )}
            </FieldArray>
          </div>

          <Field.Group name="ward" label="Ward">
            <SearchSelect.Wards
              value={values.ward}
              onChange={(value) => setFieldValue('ward', value)}
            />
          </Field.Group>

          <Field.Group name="department" label="Department">
            <SearchSelect.Departments
              value={values.department}
              onChange={(value) => setFieldValue('department', value)}
            />
          </Field.Group>

          <Field.Group name="bed" label="Bed">
            <Field.Input name="bed" value={values.bed} />
          </Field.Group>

          <Field.Group name="notes" label="Notes">
            <Field.Input
              name="notes"
              as="textarea"
              className="py-4"
              value={values.notes}
              placeholder="Type notes here..."
            />
          </Field.Group>

          <Button
            type="submit"
            disabled={!isValid}
            className="btn btn-primary w-full"
            {...{ isSubmitting }}
          >
            {button}
          </Button>
        </BaseForm>
      )}
    </Formik>
  );
}

export default Form;
