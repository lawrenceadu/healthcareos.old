import { useState } from 'react';
import { boolean, object } from 'yup';
import { Modal, Button } from '@healthcareos/react';
import { DeleteIcon } from '@healthcare/icons';
import { Formik } from 'formik';
import { schema } from '@healthcare/utils';
import { toast } from 'react-toastify';

import Form from './Form';

export interface EditProps {
  children: (props: { proceed: () => void }) => void;
}

function Edit({ children }: EditProps) {
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
        header="Create invoice"
      >
        <Formik
          validateOnMount
          validationSchema={object({
            items: schema.requireArray('Items').of(
              object().shape({
                item: schema.requireString('Item'),
                department: schema.requireString('Department'),
                quantity: schema.requireNumber('Quantity'),
                price: schema.requireNumber('Price'),
              })
            ),
            apply_insurance: boolean(),
            insurance: object().shape({
              amount: schema
                .requireNumber('Amount', false)
                .when('apply_insurance', (applied, sch) => {
                  if (applied) {
                    return sch.required('Amount is required');
                  } else {
                    return sch;
                  }
                }),
            }),
          })}
          initialValues={{
            patient_type: 'outpatient',
            items: [
              {
                item: 'registration',
                department: 'pharmacy',
                quantity: 1,
                price: 13,
              },
            ],
            insurance: {
              name: 'Nationwide medical insurance',
              number: '12345678',
              amount: 13,
            },
            apply_insurance: true,
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
          )}
        </Formik>
      </Modal>
    </>
  );
}

export default Edit;
