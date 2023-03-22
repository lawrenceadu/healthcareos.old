import { ReactElement, useState } from 'react';
import { Form as BaseForm, Formik } from 'formik';
import { Button, Field, Modal } from '@healthcareos/react';
import { schema } from '@healthcare/utils';
import { object } from 'yup';
import { toast } from 'react-toastify';

import { WardModel } from '../../../../models';
import { useStore } from '../../../../hooks';
import * as api from '../../../../services/resource';

export interface FormProps {
  mutate: () => void;
  params?: WardModel;
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
        header={params ? 'Update ward' : 'Add ward'}
      >
        <Formik
          validateOnMount
          validationSchema={object({
            name: schema.requireString('Name'),
            type: schema.requireString('Type'),
            rate: schema.requireNumber('Rate'),
            capacity: schema.requireNumber('Capacity'),
            description: schema.requireString('Department'),
          })}
          initialValues={{
            name: params?.name || '',
            type: params?.type || '',
            rate: params?.rate || '',
            capacity: params?.capacity || '',
            description: params?.description || '',
          }}
          onSubmit={(data, { setSubmitting, setErrors }) => {
            if (params) {
              api
                .updateWardService(data, params.id)
                .then(() => {
                  toast.success('Ward updated');
                  setShow(false);
                  mutate();
                })
                .catch((error) => setErrors(error?.fields || {}))
                .finally(() => setSubmitting(false));
            }

            if (!params) {
              api
                .addWardService(data)
                .then(() => {
                  toast.success('Ward added');
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
                  <Field.Input name="name" placeholder="eg. Female ward" />
                </Field.Group>

                <Field.Group name="type" label="Type">
                  <Field.Input
                    name="type"
                    placeholder="eg. female, male, detention, admission"
                  />
                </Field.Group>

                <Field.Group name="capacity" label="Capacity">
                  <Field.Input type="number" name="capacity" />
                </Field.Group>

                <Field.Group
                  name="rate"
                  label="Rate per day/night"
                  containerClassName="px-4"
                >
                  <span>{store.facility.currency_symbol}</span>
                  <Field.Input name="rate" type="number" className="!px-0" />
                </Field.Group>

                <Field.Group name="description" label="Description">
                  <Field.Input
                    as="textarea"
                    name="description"
                    className="py-4"
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
                  {params ? 'Update' : 'Add'} ward
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
