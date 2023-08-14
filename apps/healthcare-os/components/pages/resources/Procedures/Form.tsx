import { ReactElement, useState } from 'react';
import { Form as BaseForm, Formik } from 'formik';
import { Button, Field, Modal } from '@healthcareos/react';
import { schema } from '@healthcare/utils';
import { object } from 'yup';
import { toast } from 'react-toastify';

import { ProcedureModel } from '../../../../models';
import { useStore } from '../../../../hooks';
import * as api from '../../../../services/resource';

export interface FormProps {
  mutate: () => void;
  params?: ProcedureModel;
  children: (props: { proceed: () => void }) => ReactElement;
}

function Form({ params, mutate, children }: FormProps) {
  /**
   * state
   */
  const [show, setShow] = useState(false);

  /**
   * store
   */
  const { store } = useStore();

  /**
   * variables
   */
  const currency = store?.facility?.currency_symbol;

  return (
    <>
      {children({ proceed: () => setShow(true) })}

      <Modal
        show={show}
        onHide={() => setShow(false)}
        header={params ? 'Update procedure' : 'Add procedure'}
      >
        <Formik
          validateOnMount
          enableReinitialize
          validationSchema={object({
            name: schema.requireString('Name'),
            code: schema.requireString('Code'),
            description: schema.requireString('Description'),
            regular_price: schema.requireNumber('Regular price'),
            private_price: schema.requireNumber('Private insurance price'),
            nhis_price: schema.requireNumber('NHIS price'),
          })}
          initialValues={{
            name: params?.name || '',
            code: params?.code || '',
            description: params?.description || '',
            nhis_price: params?.nhis_price || '',
            regular_price: params?.regular_price || '',
            private_price: params?.private_price || '',
          }}
          onSubmit={(data, { setSubmitting, setErrors }) => {
            if (params) {
              api
                .updateProcedureService(data, params.id)
                .then(() => {
                  toast.success('Procedure updated');
                  setShow(false);
                  mutate();
                })
                .catch((error) => setErrors(error?.fields || {}))
                .finally(() => setSubmitting(false));
            }

            if (!params) {
              api
                .addProcedureService(data)
                .then(() => {
                  toast.success('Procedure added');
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
                  <Field.Input name="name" />
                </Field.Group>

                <Field.Group name="code" label="Code">
                  <Field.Input name="code" />
                </Field.Group>

                <Field.Group name="description" label="Description">
                  <Field.Input
                    as="textarea"
                    name="description"
                    className="py-4"
                  />
                </Field.Group>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-4">
                  <Field.Group
                    name="regular_price"
                    label="Regular price"
                    wrapperClassName="!mb-0"
                    containerClassName="px-4"
                  >
                    <span>{currency}</span>
                    <Field.Input
                      name="regular_price"
                      type="number"
                      className="!px-0"
                    />
                  </Field.Group>

                  <Field.Group
                    name="nhis_price"
                    label="NHIS price"
                    wrapperClassName="!mb-0"
                    containerClassName="px-4"
                  >
                    <span>{currency}</span>
                    <Field.Input
                      name="nhis_price"
                      type="number"
                      className="!px-0"
                    />
                  </Field.Group>

                  <Field.Group
                    name="private_price"
                    label="Private insurance price"
                    wrapperClassName="!mb-0"
                    containerClassName="px-4"
                  >
                    <span>{currency}</span>
                    <Field.Input
                      type="number"
                      name="private_price"
                      className="!px-0"
                    />
                  </Field.Group>
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
                  {params ? 'Update' : 'Add'} procedure
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
