import { useState } from 'react';
import { Modal, Button } from '@healthcareos/react';
import { Formik } from 'formik';
import { toast } from 'react-toastify';

import { InvoiceModel, PatientModel } from '../../../../models';
import Form, { validationSchema } from './Form';
import { usePatient } from '../../../../hooks';
import * as api from '../../../../services/patient';

export interface EditProps {
  patient?: PatientModel;
  mutate: () => void;
  invoice: InvoiceModel;
  children: (props: { proceed: () => void }) => void;
}

function Edit({ patient: basePatient, mutate, invoice, children }: EditProps) {
  /**
   * state
   */
  const [show, setShow] = useState(false);

  /**
   * hooks
   */
  const { patient } = usePatient(basePatient?.id);

  return (
    <>
      {children({ proceed: () => setShow(true) })}
      <Modal
        size="xl"
        show={show}
        onHide={() => setShow(false)}
        header="Update invoice"
      >
        <Formik
          validateOnMount
          validationSchema={validationSchema}
          initialValues={{
            insurance: false,
            notes: invoice?.notes || '',
            status: invoice?.status || 'unpaid',
            charges: invoice?.details?.map(
              ({ charge, department, quantity, description, unit_price }) => ({
                quantity,
                description,
                price: unit_price,
                charge: {
                  value: charge.id,
                  label: charge.name,
                  charge: {
                    ...charge,
                    nhis_price: unit_price,
                    regular_price: unit_price,
                    private_price: unit_price,
                  },
                },
                department: { label: department.name, value: department.id },
              })
            ) || [
              {
                charge: { label: '', value: '' },
                department: { label: '', value: '' },
                quantity: 1,
                description: '',
              },
            ],
          }}
          onSubmit={({ charges, ...params }, { setErrors, setSubmitting }) => {
            const data = {
              ...params,
              patient: patient.id,
              charges: charges.map(({ charge, department, ...i }) => ({
                ...i,
                id: charge.value,
                department: department.value,
              })),
            };

            api
              .updatePatientInvoiceService(data, invoice.id)
              .then(() => {
                toast.error('Invoice has been finalized');
                setShow(false);
                mutate();
              })
              .catch((error) => setErrors(error?.fields || {}))
              .finally(() => setSubmitting(false));
          }}
        >
          {({ values, isValid, isSubmitting, setFieldValue }) => (
            <div>
              <Form readonly={invoice.readonly} {...{ values, setFieldValue }}>
                <Button
                  type="submit"
                  disabled={!isValid}
                  className="btn btn-primary"
                  {...{ isSubmitting }}
                >
                  Update invoice
                </Button>
              </Form>
            </div>
          )}
        </Formik>
      </Modal>
    </>
  );
}

export default Edit;
