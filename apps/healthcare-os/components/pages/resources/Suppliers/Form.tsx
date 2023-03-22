import { ReactElement, useState } from 'react';
import { Form as BaseForm, Formik } from 'formik';
import { Button, Field, Modal } from '@healthcareos/react';
import { schema } from '@healthcare/utils';
import { object } from 'yup';
import { toast } from 'react-toastify';

import { SupplierModel } from '../../../../models';
import * as api from '../../../../services/resource';

export interface FormProps {
  mutate: () => void;
  params?: SupplierModel;
  children: (props: { proceed: () => void }) => ReactElement;
}

function Form({ mutate, children, params }: FormProps) {
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
        header={params ? 'Update supplier' : 'Add supplier'}
      >
        <Formik
          validateOnMount
          validationSchema={object({
            name: schema.requireString('Name'),
            phone: schema.requirePhoneNumber('Phone'),
            email: schema.requireEmail('Email'),
            address: schema.requireString('Address'),
          })}
          initialValues={{
            name: params?.name || '',
            phone: params?.phone || '',
            email: params?.email || '',
            address: params?.address || '',
          }}
          onSubmit={(data, { setSubmitting, setErrors }) => {
            if (params) {
              api
                .updateSupplierService(data, params.id)
                .then(() => {
                  toast.success('Supplier updated');
                  setShow(false);
                  mutate();
                })
                .catch((error) => setErrors(error?.fields || {}))
                .finally(() => setSubmitting(false));
            }

            if (!params) {
              api
                .addSupplierService(data)
                .then(() => {
                  toast.success('Supplier added');
                  setShow(false);
                  mutate();
                })
                .catch((error) => setErrors(error?.fields || {}))
                .finally(() => setSubmitting(false));
            }
          }}
        >
          {({
            values,
            isValid,
            isSubmitting,
            setFieldValue,
            setFieldTouched,
          }) => (
            <BaseForm>
              <div className="p-6">
                <Field.Group name="name" label="Name">
                  <Field.Input name="name" />
                </Field.Group>

                <Field.Group name="phone" label="Phone">
                  <Field.Phone
                    name="phone"
                    value={values.phone}
                    {...{ setFieldValue, setFieldTouched }}
                  />
                </Field.Group>

                <Field.Group name="email" label="Email address">
                  <Field.Input type="email" name="email" />
                </Field.Group>

                <Field.Group name="address" label="Address">
                  <Field.Input name="address" />
                </Field.Group>
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
                  {params ? 'Update' : 'Add'} supplier
                </Button>
              </div>
            </BaseForm>
          )}
        </Formik>
      </Modal>
    </>
  );
}

export default Form;
