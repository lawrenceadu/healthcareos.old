import { ReactElement, useState } from 'react';
import { Formik, Form as BaseForm } from 'formik';
import { Modal, Field, Button } from '@healthcareos/react';
import { schema } from '@healthcare/utils';
import { object } from 'yup';
import { toast } from 'react-toastify';

import { InstitutionModel } from '../../../../models/institution';
import * as api from '../../../../services/resource';

export interface FormProps {
  children: (props: { proceed: () => void }) => ReactElement;
  params?: InstitutionModel;
  mutate: () => void;
}

function Form({ children, params, mutate }: FormProps) {
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
        header={params ? 'Update institution' : 'Add institution'}
      >
        <Formik
          validateOnMount
          enableReinitialize
          validationSchema={object({
            name: schema.requireString('Name'),
            email: schema.requireEmail('Email address', false),
            phone: schema.requirePhoneNumber('Phone number', false),
            address: schema.requireString('Address', false),
          })}
          initialValues={{
            name: params?.name || '',
            email: params?.email || '',
            phone: params?.phone || '',
            address: params?.address || '',
          }}
          onSubmit={(data, { setSubmitting, setErrors }) => {
            (() => {
              if (params) {
                return api
                  .updateInstitutionService(data, params.id)
                  .then(() => {
                    toast.success('Institution updated');
                  });
              }

              if (!params) {
                return api.addInstitutionService(data).then(() => {
                  toast.success('Institution added');
                });
              }
            })()
              .then(() => {
                mutate();
                setShow(false);
              })
              .catch((error) => {
                if (error?.fields) {
                  return setErrors(error.fields);
                }
                if (error?.message) {
                  return toast.error(error.message);
                }
              })
              .finally(() => setSubmitting(false));
          }}
        >
          {({
            values,
            isValid,
            handleSubmit,
            isSubmitting,
            setFieldValue,
            setFieldTouched,
          }) => (
            <BaseForm>
              <div className="p-6">
                <Field.Group name="name" label="Name">
                  <Field.Input name="name" />
                </Field.Group>
                <Field.Group name="email" label="Email">
                  <Field.Input type="email" name="email" />
                </Field.Group>
                <Field.Group name="phone" label="Phone">
                  <Field.Phone
                    name="phone"
                    value={values.phone}
                    {...{ setFieldTouched, setFieldValue }}
                  />
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
                  className="btn-primary"
                  disabled={!isValid}
                  {...{ isSubmitting }}
                >
                  {params ? 'Update institution' : 'Add institution'}
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
