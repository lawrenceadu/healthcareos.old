import { useState } from 'react';
import { Button, Field, Modal as BaseModal, ModalProps, Dropdown } from '@healthcareos/react'; // prettier-ignore
import { helpers, schema } from '@healthcare/utils';
import { Form, Formik } from 'formik';
import { NotesIcon } from '@healthcare/icons';
import { object } from 'yup';
import { toast } from 'react-toastify';

import Select from '../Select';

export interface DispenseProps {
  prescriptions: string[];
  children: (props: { proceed: () => void }) => void;
}

export function Dispense({ children, prescriptions }: DispenseProps) {
  /**
   * state
   */
  const [show, setShow] = useState(false);

  return (
    <>
      {children({ proceed: () => setShow(true) })}
      <Modal
        show={show}
        onHide={() => setShow(false)}
        prescriptions={prescriptions}
      />
    </>
  );
}

export function Modal({ ...props }: ModalProps & { prescriptions: string[] }) {
  /**
   * variables
   */
  const initialValues = {
    drug: '',
    dose: '10',
    dose_unit: 'ml',
    quantity: '10',
    type: 'dispense',
  };

  return (
    <BaseModal {...props} header="Dispense drug" size="xl">
      <div className="max-h-[600px] overflow-y-auto">
        <Formik
          validateOnMount
          enableReinitialize
          validationSchema={object({
            prescriptions: schema.requireArray('Prescriptions').of(
              object().shape({
                drug: schema.requireString('Drug'),
                dose: schema.requireNumber('Dose'),
                dose_unit: schema.requireString('Dose unit'),
                quantity: schema.requireNumber('Quantity'),
                type: schema.requireString('Type'),
              })
            ),
          })}
          initialValues={{
            prescriptions: [
              {
                ...initialValues,
                drug: 'Dexamethasone (0.5 mg/5ml oral liquid)',
              },
              { ...initialValues, drug: 'Paracetamol 500 mg tablet' },
            ],
            notes: '',
          }}
          onSubmit={() => {
            toast.success('Prescriptions dispensed');
            props.onHide?.();
          }}
        >
          {({ values, isValid, isSubmitting, handleSubmit, setFieldValue }) => (
            <Form>
              <div className="p-6">
                <div className="grid gap-4 mb-6">
                  {values.prescriptions.map((pres, key) => (
                    <div
                      key={key}
                      className="grid gap-4 lg:grid-cols-[400px_repeat(3,minmax(0,1fr))_3rem]"
                    >
                      <Field.Group
                        label="Drug"
                        wrapperClassName="!mb-0"
                        name={`prescriptions.${key}.drug`}
                      >
                        <Field.Input
                          value={pres.drug}
                          name={`prescriptions.${key}.drug`}
                        />
                      </Field.Group>

                      <Field.Group
                        label="Dose"
                        wrapperClassName="!mb-0"
                        name={`prescriptions.${key}.dose`}
                      >
                        <Field.Input
                          name={`prescriptions.${key}.dose`}
                          value={pres.dose}
                        />
                        <Select
                          value={pres.dose_unit}
                          options={[{ label: 'ml', value: 'ml' }]}
                          onSelect={(value) =>
                            setFieldValue('dose_unit', value)
                          }
                        />
                      </Field.Group>

                      <Field.Group
                        wrapperClassName="!mb-0"
                        label="Quantity to be dispensed"
                        name={`prescription.${key}.quantity`}
                      >
                        <Field.Input
                          type="number"
                          value={pres.quantity}
                          name={`prescription.${key}.quantity`}
                        />
                      </Field.Group>

                      <Field.Group
                        label="Dispense type"
                        wrapperClassName="!mb-0"
                        name={`prescription.${key}.type`}
                      >
                        <Field.Select
                          value={pres.type}
                          name={`prescription.${key}.type`}
                          options={[
                            { label: 'Dispense', value: 'dispense' },
                            {
                              label: 'Dispense alternative',
                              value: 'alternative',
                            },
                            { label: 'Paper prescription', value: 'paper' },
                          ]}
                          onChange={({ value }: { value: string }) =>
                            setFieldValue(`prescriptions.${key}.type`, value)
                          }
                        />
                      </Field.Group>
                      <div>
                        {key === 0 && (
                          <Dropdown>
                            <Dropdown.Toggle
                              type="button"
                              className="mt-6 px-3"
                            >
                              <NotesIcon />
                            </Dropdown.Toggle>
                            <Dropdown.Menu className="max-w-[300px] p-4">
                              <div>
                                Lorem ipsum dolor sit amet consectetur
                                adipisicing elit. Placeat nesciunt
                                necessitatibus rem, at, fuga consequuntur
                                doloribus veritatis aliquid recusandae velit id,
                                quam expedita. Atque magnam, autem tempora in
                                harum quaerat?
                              </div>
                            </Dropdown.Menu>
                          </Dropdown>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <Field.Group name="notes" label="Additional notes">
                  <Field.Input
                    as="textarea"
                    className="py-4"
                    value={values.notes}
                  />
                </Field.Group>
              </div>

              <div
                className={helpers.classNames(
                  'px-6 py-3',
                  'sticky bottom-0 bg-white',
                  'flex justify-end gap-6',
                  'border-t border-gray-200'
                )}
              >
                <Button
                  type="button"
                  className="btn-light"
                  onClick={() => props.onHide?.()}
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
                  Dispense
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </BaseModal>
  );
}

export default Dispense;
