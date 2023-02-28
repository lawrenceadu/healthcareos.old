import { useState } from 'react';
import { Button, Field, Modal } from '@healthcareos/react';
import { Form, Formik } from 'formik';
import { schema } from '@healthcare/utils';
import { object } from 'yup';
import { toast } from 'react-toastify';

export interface VitalsProps {
  children: (props: { proceed: () => void }) => void;
}

export function Vitals({ children }: VitalsProps) {
  /**
   * state
   */
  const [show, setShow] = useState(false);

  return (
    <>
      {children({ proceed: () => setShow(true) })}

      <Modal show={show} onHide={() => setShow(false)} header="Add vitals">
        <Formik
          validateOnMount
          validationSchema={object({
            respiratory_rate: schema.requireNumber('Respiratory rate', false),
            oxygen_saturation: schema.requireNumber('Respiratory rate', false),
            oxygen_fraction: schema.requireNumber('Respiratory rate', false),
            heart_rate: schema.requireNumber('Respiratory rate', false),
            systolic: schema.requireNumber('Respiratory rate', false),
            diastolic: schema.requireNumber('Respiratory rate', false),
            temperature: schema.requireNumber('Respiratory rate', false),
            height: schema.requireNumber('Respiratory rate', false),
            weight: schema.requireNumber('Respiratory rate', false),
            bmi: schema.requireNumber('Respiratory rate', false),
            body_surface_area: schema.requireNumber('Respiratory rate', false),
            notes: schema.requireNumber('Respiratory rate', false),
          })}
          initialValues={{
            respiratory_rate: '',
            oxygen_saturation: '',
            oxygen_fraction: '',
            heart_rate: '',
            systolic: '',
            diastolic: '',
            temperature: '',
            height: '',
            weight: '',
            bmi: '',
            body_surface_area: '',
            notes: '',
          }}
          onSubmit={() => {
            toast.success('Vitals added to history');
            setShow(false);
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
                  name="oxygen_saturation"
                  label="Oxygen saturations"
                >
                  <Field.Input
                    name="oxygen_saturation"
                    value={values.oxygen_saturation}
                  />
                  <span className="px-4">%</span>
                </Field.Group>

                <Field.Group
                  name="oxygen_fraction"
                  label="Fraction of inspired oxygen"
                >
                  <Field.Input
                    name="oxygen_fraction"
                    value={values.oxygen_fraction}
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
                  Add vitals
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
