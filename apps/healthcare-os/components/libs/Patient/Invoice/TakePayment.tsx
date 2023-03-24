import { ReactElement, useState } from 'react';
import { Modal, Button, Field } from '@healthcareos/react';
import { Form, Formik } from 'formik';
import { schema } from '@healthcare/utils';
import { object } from 'yup';
import { toast } from 'react-toastify';

import { finalizePatientInvoiceService } from '../../../../services/patient';
import { InvoiceModel } from '../../../../models';
import { useStore } from '../../../../hooks';

export interface TakePaymentProps {
  mutate: () => void;
  invoice: InvoiceModel;
  children: (props: { proceed: () => void }) => ReactElement;
}

function TakePayment({ children, mutate, invoice }: TakePaymentProps) {
  /**
   * state
   */
  const [show, setShow] = useState(false);

  /**
   * hook
   */
  const { store } = useStore();

  return (
    <>
      {children({ proceed: () => setShow(true) })}

      <Modal show={show} onHide={() => setShow(false)} header="Take payment">
        <Formik
          validateOnMount
          validationSchema={object({
            status: schema.requireString('Status'),
            discount: schema
              .requireNumber('Discount', false)
              .max(invoice.total, 'Cannot be more that invoice total'),
            payment_method: schema.requireString('Payment method'),
            payment_details: schema.requireString('Payment details'),
          })}
          initialValues={{
            status: 'paid',
            discount: 0,
            payment_method: '',
            payment_details: '',
          }}
          onSubmit={(params, { setSubmitting, setErrors }) => {
            finalizePatientInvoiceService(params, invoice.id)
              .then(() => {
                toast.success('Invoice finalized');
                setShow(false);
                mutate();
              })
              .catch((error) => setErrors(error?.fields || {}))
              .finally(() => setSubmitting(false));
          }}
        >
          {({ values, isValid, isSubmitting, setFieldValue }) => (
            <Form>
              <div className="p-6">
                <Field.Group name="payment_method" label="Payment method">
                  <Field.Select
                    value={values.payment_method}
                    onChange={({ value }) =>
                      setFieldValue('payment_method', value)
                    }
                    options={[
                      { label: 'Cash', value: 'cash' },
                      { label: 'Mobile Money', value: 'momo' },
                      { label: 'Cheque', value: 'cheque' },
                      { label: 'Transfer', value: 'transfer' },
                      { label: 'Insurance', value: 'insurance' },
                      { label: 'Other', value: 'other' },
                    ]}
                  />
                </Field.Group>
                <Field.Group name="payment_details" label="Payment details">
                  <Field.Input
                    as="textarea"
                    className="py-4"
                    name="payment_details"
                    placeholder="eg. 054XXXXXXX"
                  />
                </Field.Group>

                {!!invoice.readonly && (
                  <Field.Group
                    name="discount"
                    label="Discount"
                    containerClassName="!px-4"
                  >
                    <span>{store.facility.currency_symbol}</span>
                    <Field.Input
                      type="number"
                      name="discount"
                      className="!px-0"
                    />
                  </Field.Group>
                )}
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
                  Take payment [{store.facility.currency_symbol}
                  {invoice.total - values.discount}]
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </Modal>
    </>
  );
}

export default TakePayment;
