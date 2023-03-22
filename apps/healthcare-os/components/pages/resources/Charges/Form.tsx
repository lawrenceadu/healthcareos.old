import { ReactElement, useState } from 'react';
import { Form as BaseForm, Formik } from 'formik';
import { Button, Field, Modal } from '@healthcareos/react';
import { schema } from '@healthcare/utils';
import { object } from 'yup';
import { toast } from 'react-toastify';

import { ChargeModel } from '../../../../models';
import { useStore } from '../../../../hooks';
import * as api from '../../../../services/resource';

export interface FormProps {
  mutate: () => void;
  params?: ChargeModel;
  children: (props: { proceed: () => void }) => ReactElement;
}

function Form({ mutate, children, params }: FormProps) {
  /**
   * state
   */
  const [show, setShow] = useState(false);

  /**
   * store
   */
  const { store } = useStore();

  return (
    <>
      {children({ proceed: () => setShow(true) })}

      <Modal
        show={show}
        onHide={() => setShow(false)}
        header={params ? 'Update charge' : 'Add charge'}
      >
        <Formik
          validateOnMount
          validationSchema={object({
            name: schema.requireString('Name'),
            type: schema.requireString('Type'),
            regular_price: schema.requireNumber('Regular price'),
            private_price: schema.requireNumber('Private insurance price'),
            nhis_price: schema.requireNumber('NHIS price'),
          })}
          initialValues={{
            name: params?.name || '',
            type: params?.type || '',
            nhis_price: params?.nhis_price || '',
            regular_price: params?.regular_price || '',
            private_price: params?.private_price || '',
          }}
          onSubmit={(data, { setSubmitting, setErrors }) => {
            if (params) {
              api
                .updateChargeService(data, params.id)
                .then(() => {
                  toast.success('Charge updated');
                  setShow(false);
                  mutate();
                })
                .catch((error) => setErrors(error?.fields || {}))
                .finally(() => setSubmitting(false));
            }

            if (!params) {
              api
                .addChargeService(data)
                .then(() => {
                  toast.success('Charge added');
                  setShow(false);
                  mutate();
                })
                .catch((error) => setErrors(error?.fields || {}))
                .finally(() => setSubmitting(false));
            }
          }}
        >
          {({ values, isValid, isSubmitting, setFieldValue }) => (
            <BaseForm>
              <div className="p-6">
                <Field.Group name="name" label="Name">
                  <Field.Input name="name" placeholder="Consultation service" />
                </Field.Group>

                <Field.Group name="type" label="Type">
                  <Field.Input name="type" placeholder="eg. consultation" />
                </Field.Group>

                <Field.Group
                  name="regular_price"
                  label="Regular price"
                  containerClassName="px-4"
                >
                  <span>{store.facility.currency_symbol}</span>
                  <Field.Input
                    name="regular_price"
                    type="number"
                    className="!px-0"
                  />
                </Field.Group>

                <Field.Group
                  name="nhis_price"
                  label="NHIS price"
                  containerClassName="px-4"
                >
                  <span>{store.facility.currency_symbol}</span>
                  <Field.Input
                    name="nhis_price"
                    type="number"
                    className="!px-0"
                  />
                </Field.Group>

                <Field.Group
                  name="private_price"
                  label="Private insurance price"
                  containerClassName="px-4"
                >
                  <span>{store.facility.currency_symbol}</span>
                  <Field.Input
                    type="number"
                    name="private_price"
                    className="!px-0"
                  />
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
                  {params ? 'Update' : 'Add'} charge
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
