import { ReactElement, useState } from 'react';
import { Button, Confirm, Field, Modal } from '@healthcareos/react';
import { FieldArray, Form, Formik } from 'formik';
import { helpers, schema } from '@healthcare/utils';
import { boolean, object } from 'yup';
import { PlusIcon } from '@healthcare/icons';
import { toast } from 'react-toastify';

import { MedicineModel, PrescriptionModel } from '../../../../../models'; // prettier-ignore
import BatchSelect, { medicinesSchema } from '../../Components/BatchSelect';
import { useLocations, useStore } from '../../../../../hooks';
import * as api from '../../../../../services/pharmacy';

export interface DispenseProps {
  mutate: () => void;
  prescription: PrescriptionModel;
  children: (props: { proceed: () => void }) => ReactElement;
}

function Dispense({ mutate, prescription, children }: DispenseProps) {
  /**
   * state
   */
  const [show, setShow] = useState(false);

  /**
   * hook
   */
  const locations = useLocations();
  const { store } = useStore();

  /**
   * function
   */
  const handleDataClearUp = (values: any) => {
    const data = {
      ...values,
      patient: prescription?.patient?.id,
      medicines: values?.medicines?.map(({ medicine, ...i }) => ({
        ...i,
        id: medicine.value,
      })),
    };

    return data;
  };

  return (
    <>
      {children({ proceed: () => setShow(true) })}

      <Modal
        size="xl"
        show={show}
        onHide={() => setShow(false)}
        header="Dispense prescription"
      >
        <Formik
          validateOnMount
          validationSchema={object({
            prescription: schema.requireString('Prescription'),
            insurance: boolean(),
            location: schema.requireString('Location'),
            medicines: medicinesSchema,
          })}
          initialValues={{
            prescription: prescription.id,
            insurance: false,
            location: '',
            medicines: prescription.medicines.map((i) => ({
              medicine: {
                label: i.medicine.name,
                value: i.medicine.id,
                medicine: {} as MedicineModel,
              },
              expiry_date: '',
              quantity: '',
              batch_no: '',
            })),
          }}
          onSubmit={(params, { setSubmitting, setErrors }) => {
            const data = handleDataClearUp(params);

            api
              .getDispenseTotalService(data)
              .then(({ total }: { total: { total: number } }) => {
                Confirm({
                  header: 'Dispense medicines',
                  message: (
                    <>
                      <p>
                        Total price of medicines:{' '}
                        <b>
                          {`${
                            store.facility.currency_symbol
                          } ${helpers.formatNumber(total.total)}`}
                          .
                        </b>
                      </p>
                      <p>
                        Are you sure you want to dispense these medicines? Once
                        you dispense you cannot update it
                      </p>
                    </>
                  ),
                  buttons: {
                    proceed: { className: 'btn-primary' },
                  },
                }).then((proceed) => {
                  if (proceed) {
                    api
                      .dispensePrescriptionService(data)
                      .then(() => {
                        toast.success('Medicines dispensed');
                        setShow(false);
                        mutate?.();
                      })
                      .catch((error) =>
                        toast.error(
                          error?.message || 'Unable to dispense medicines'
                        )
                      )
                      .finally(() => setSubmitting(false));
                  } else {
                    setSubmitting(false);
                  }
                });
              })
              .catch((error) => {
                setSubmitting(false);

                if (error?.fields) {
                  setErrors(error?.fields);
                }

                toast.error(
                  error?.message || 'Unable to calculate total price'
                );
              });
          }}
        >
          {({
            values,
            isValid,
            isSubmitting,
            setFieldValue,
            setFieldTouched,
          }) => (
            <Form>
              <div className="p-6 max-h-[600px] overflow-y-auto">
                <FieldArray name="medicines">
                  {(helper) => (
                    <div className="mb-6">
                      <div className="grid gap-6 mb-4">
                        {values.medicines.map((medicine, key) => (
                          <BatchSelect
                            key={key}
                            index={key}
                            medicine={medicine}
                            medicines={values.medicines}
                            id={medicine?.medicine?.value}
                            remove={() => helper.remove(key)}
                            {...{ setFieldValue, setFieldTouched }}
                          />
                        ))}
                      </div>
                      <Button
                        type="button"
                        className="btn-light"
                        onClick={() => helper.push({})}
                      >
                        <PlusIcon />
                        <span>Add medicine</span>
                      </Button>
                    </div>
                  )}
                </FieldArray>

                <div className="max-w-[400px]">
                  <Field.Group name="location" label="Location">
                    <Field.Select
                      menuPlacement="top"
                      value={values.location}
                      placeholder="Select dispense location"
                      onChange={({ value }) => setFieldValue('location', value)}
                      options={locations.map((i) => ({
                        label: i.name,
                        value: i.id,
                      }))}
                    />
                  </Field.Group>

                  <Field.Toggle
                    name="insurance"
                    checked={values.insurance}
                    onChange={(checked) => setFieldValue('insurance', checked)}
                  >
                    <p className="ml-4">Apply Insurance?</p>
                  </Field.Toggle>
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
                  Dispense
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </Modal>
    </>
  );
}

export default Dispense;
