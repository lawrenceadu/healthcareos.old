import { useState } from 'react';
import { Modal, Button } from '@healthcareos/react';
import { SaveIcon } from '@healthcare/icons';
import { Formik } from 'formik';
import { toast } from 'react-toastify';

import { createPatientInvoiceService } from '../../../../services/patient';
import Form, { validationSchema } from './Form';
import { usePatient } from '../../../../hooks';

export interface AddProps {
  mutate: () => void;
  children: (props: { proceed: () => void }) => void;
}

function Add({ mutate, children }: AddProps) {
  /**
   * state
   */
  const [show, setShow] = useState(false);

  /**
   * hooks
   */
  const { patient } = usePatient();

  return (
    <>
      {children({ proceed: () => setShow(true) })}
      <Modal
        size="xl"
        show={show}
        onHide={() => setShow(false)}
        header="Create invoice"
      >
        <Formik
          validateOnMount
          validationSchema={validationSchema}
          initialValues={{
            insurance: false,
            notes: '',
            status: 'unpaid',
            charges: [
              {
                charge: { label: '', value: '' },
                department: { label: '', value: '' },
                quantity: 1,
                description: '',
              },
            ],
          }}
          onSubmit={({ charges, ...params }, { setSubmitting }) => {
            const data = {
              ...params,
              patient: patient.id,
              charges: charges.map(({ charge, department, ...i }) => ({
                ...i,
                id: charge.value,
                department: department.value,
              })),
            };

            createPatientInvoiceService(data)
              .then(() => {
                toast.success('Invoice created');
                setShow(false);
                mutate?.();
              })
              .catch((error) =>
                toast.error(error?.message || 'Unable to create invoice')
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
            <Form {...{ values, setFieldValue }}>
              <Button
                type="submit"
                disabled={!isValid}
                className="btn btn-primary"
                isSubmitting={isSubmitting}
              >
                Create invoice
              </Button>
            </Form>
          )}
        </Formik>
      </Modal>
    </>
  );
}

export default Add;
