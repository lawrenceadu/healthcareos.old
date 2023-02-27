import { useState } from 'react';
import { Form, Formik } from 'formik';
import { DrugIcon } from '@healthcare/icons';
import { Button } from '@healthcareos/react';
import { helpers, schema } from '@healthcare/utils';
import { object } from 'yup';

import { Modal } from '../Dispense';

import Prescription from './Prescription';

export function Medication({ onHide }: { onHide: () => void }) {
  /**
   * variables
   */
  const hasMedication = true;

  /**
   * state
   */
  const [items, setItems] = useState<string[]>([]);
  const [dispense, setDispense] = useState(false);

  return (
    <>
      {hasMedication && (
        <Formik
          validateOnMount
          validationSchema={object({
            prescriptions: schema
              .requireArray('Prescriptions')
              .of(schema.requireString('Prescription')),
          })}
          initialValues={{
            prescriptions: [] as string[],
          }}
          onSubmit={({ prescriptions }, { setSubmitting }) => {
            setItems(prescriptions);
            setDispense(true);
            setSubmitting(false);
          }}
        >
          {({ values, isValid, isSubmitting, handleSubmit }) => (
            <Form>
              <div className="flex flex-col gap-6 px-6 pb-10">
                {Array.from({ length: 5 }, (_, i) => (
                  <Prescription
                    key={i}
                    value={i + 1}
                    name="prescriptions"
                    checked={values.prescriptions.includes(String(i + 1))}
                  />
                ))}
              </div>
              <div
                className={helpers.classNames(
                  'bg-white',
                  'px-6 py-3',
                  'sticky bottom-0',
                  'flex gap-6 justify-end',
                  'border-t border-gray-200'
                )}
              >
                <Button
                  type="submit"
                  className="btn-light"
                  onClick={() => onHide()}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={!isValid}
                  onClick={() => handleSubmit()}
                  className="btn btn-primary"
                  {...{ isSubmitting }}
                >
                  Dispense medication
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      )}

      {!hasMedication && (
        <div className="max-w-[328px] w-full mx-auto text-center px-6 pb-10">
          <div className="h-10 w-10 rounded-full bg-gray-100 flex mx-auto mb-4">
            <DrugIcon variant="solid" className="text-primary m-auto" />
          </div>
          <div>
            <p className="font-bold mb-1">No prescription yet</p>
            <p className="text-sm font-medium text-muted">
              This patient hasn&apos;t received any prescription yet.
            </p>
          </div>
        </div>
      )}

      {/* dispense medication modal */}
      <Modal
        index={1}
        show={dispense}
        prescriptions={items}
        onHide={() => setDispense(false)}
      />
    </>
  );
}

export default Medication;
