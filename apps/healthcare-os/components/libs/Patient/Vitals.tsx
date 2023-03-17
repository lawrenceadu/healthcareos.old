import { useState } from 'react';
import { Button, Field, Modal } from '@healthcareos/react';
import { Form, Formik } from 'formik';
import { schema } from '@healthcare/utils';
import { object } from 'yup';
import { toast } from 'react-toastify';

import { usePatient } from '../../../hooks';
import * as api from '../../../services/patient';

type ParamsProps = {
  respiratory_rate: string;
  oxygen_saturations: string;
  fraction_of_inspired_oxygen: string;
  heart_rate: string;
  systolic: string;
  diastolic: string;
  temperature: string;
  height: string;
  weight: string;
  bmi: string;
  body_surface_area: string;
  notes: string;

  id: string;
};

export interface VitalsProps {
  params?: ParamsProps;
  children: (props: { proceed: () => void }) => void;
}

export function Vitals({ params, children }: VitalsProps) {
  /**
   * state
   */
  const [show, setShow] = useState(false);

  /**
   * hook
   */
  const { patient, updateHistory } = usePatient();

  return (
    <>
      {children({ proceed: () => setShow(true) })}

      <Modal
        show={show}
        onHide={() => setShow(false)}
        header={params ? 'Update vitals' : 'Add vitals'}
      >
        <Formik
          validateOnMount
          enableReinitialize
          validationSchema={object({
            respiratory_rate: schema.requireNumber('Respiratory rate', false),
            oxygen_saturations: schema.requireNumber('Oxygen saturations', false), // prettier-ignore
            fraction_of_inspired_oxygen: schema.requireNumber('Inspired oxygen', false), // prettier-ignore
            heart_rate: schema.requireNumber('Heart rate', false),
            systolic: schema.requireNumber('Systolic', false),
            diastolic: schema.requireNumber('Diastolic', false),
            temperature: schema.requireNumber('Temperature', false),
            height: schema.requireNumber('Height', false),
            weight: schema.requireNumber('Weight', false),
            bmi: schema.requireNumber('BMI', false),
            body_surface_area: schema.requireNumber('Body surface area', false),
            notes: schema.requireString('Notes', false),
          })}
          initialValues={{
            respiratory_rate: params?.respiratory_rate || '',
            oxygen_saturations: params?.oxygen_saturations || '',
            fraction_of_inspired_oxygen:
              params?.fraction_of_inspired_oxygen || '',
            heart_rate: params?.heart_rate || '',
            systolic: params?.systolic || '',
            diastolic: params?.diastolic || '',
            temperature: params?.temperature || '',
            height: params?.height || '',
            weight: params?.weight || '',
            bmi: params?.bmi || '',
            body_surface_area: params?.body_surface_area || '',
            notes: params?.notes || '',
          }}
          onSubmit={(data, { setSubmitting, setErrors }) => {
            // if new vitals
            if (!params) {
              api
                .createVitalsService({ ...data, patient: patient.id })
                .then(() => {
                  toast.success('Vitals added to history');
                  updateHistory();
                  setShow(false);
                })
                .catch((error) => setErrors(error?.fields || {}))
                .finally(() => setSubmitting(false));
            }

            // if update vitals
            if (params) {
              api
                .updateVitalsService(data, params.id)
                .then(() => {
                  toast.success('Vitals updated');
                  updateHistory();
                  setShow(false);
                })
                .catch((error) => setErrors(error?.fields || {}))
                .finally(() => setSubmitting(false));
            }
          }}
        >
          {({ values, isValid, isSubmitting, handleSubmit }) => (
            <Form>
              <div className="py-10 px-6 max-h-[546px] overflow-y-auto">
                <Field.Group name="respiratory_rate" label="Respiratory rate">
                  <Field.Input
                    name="respiratory_rate"
                    value={values.respiratory_rate}
                  />
                  <span className="px-4">bpm</span>
                </Field.Group>

                <Field.Group
                  name="oxygen_saturations"
                  label="Oxygen saturations"
                >
                  <Field.Input
                    name="oxygen_saturations"
                    value={values.oxygen_saturations}
                  />
                  <span className="px-4">%</span>
                </Field.Group>

                <Field.Group
                  name="fraction_of_inspired_oxygen"
                  label="Fraction of inspired oxygen"
                >
                  <Field.Input
                    name="fraction_of_inspired_oxygen"
                    value={values.fraction_of_inspired_oxygen}
                  />
                  <span className="px-4">%</span>
                </Field.Group>

                <Field.Group name="heart_rate" label="Heart rate">
                  <Field.Input name="heart_rate" value={values.heart_rate} />
                  <span className="px-4">bpm</span>
                </Field.Group>

                <Field.Group name="systolic" label="Systolic">
                  <Field.Input name="systolic" value={values.systolic} />
                  <span className="px-4">mmHG</span>
                </Field.Group>

                <Field.Group name="diastolic" label="Diastolic">
                  <Field.Input name="diastolic" value={values.diastolic} />
                  <span className="px-4">mmHG</span>
                </Field.Group>

                <Field.Group name="temperature" label="Temperature">
                  <Field.Input name="temperature" value={values.temperature} />
                  <span className="px-4">C</span>
                </Field.Group>

                <Field.Group name="height" label="Height">
                  <Field.Input name="height" value={values.height} />
                  <span className="px-4">cm</span>
                </Field.Group>

                <Field.Group name="weight" label="Weight">
                  <Field.Input name="weight" value={values.weight} />
                  <span className="px-4">kg</span>
                </Field.Group>

                <Field.Group name="bmi" label="BMI">
                  <Field.Input name="bmi" value={values.bmi} />
                  <span className="px-4">kg/m2</span>
                </Field.Group>

                <Field.Group name="body_surface_area" label="Body surface area">
                  <Field.Input
                    name="body_surface_area"
                    value={values.body_surface_area}
                  />
                  <span className="px-4">kg</span>
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

              <div className="sticky bottom-0 flex gap-6 justify-end bg-white border-t border-gray-200 py-3 px-6">
                <Button>Cancel</Button>
                <Button
                  type="submit"
                  disabled={!isValid}
                  onClick={() => handleSubmit()}
                  className="btn btn-primary"
                  {...{ isSubmitting }}
                >
                  {params ? 'Update vitals' : 'Add vitals'}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </Modal>
    </>
  );
}

export default Vitals;
