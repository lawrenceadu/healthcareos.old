import { useState } from 'react';
import { Modal, Button } from '@healthcareos/react';
import { DeleteIcon } from '@healthcare/icons';
import { Formik } from 'formik';
import { toast } from 'react-toastify';

import Form, { validationSchema } from './Form';
import { InvoiceModel } from '../../../../models';

export interface EditProps {
  invoice: InvoiceModel;
  children: (props: { proceed: () => void }) => void;
}

function Edit({ invoice, children }: EditProps) {
  /**
   * state
   */
  const [show, setShow] = useState(false);

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
          onSubmit={(params) => {
            toast.error('Invoice has been finalized');
            setShow(false);
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
            <div>
              <Form {...{ values, setFieldValue }}>
                <Button
                  type="submit"
                  disabled={!isValid}
                  className="btn btn-primary"
                  onClick={() => handleSubmit()}
                  {...{ isSubmitting }}
                >
                  Finalize invoice
                </Button>
                <Button type="button" className="btn-error-outline">
                  <DeleteIcon />
                  <span>Delete</span>
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
