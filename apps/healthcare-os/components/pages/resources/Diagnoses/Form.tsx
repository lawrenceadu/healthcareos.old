import { ReactElement, useState } from 'react';
import { Form as BaseForm, Formik } from 'formik';
import { Button, Field, Modal } from '@healthcareos/react';
import { schema } from '@healthcare/utils';
import { object } from 'yup';
import { toast } from 'react-toastify';

import { DiagnosisModel } from '../../../../models';
import * as api from '../../../../services/resource';

export interface FormProps {
  mutate: () => void;
  params?: DiagnosisModel;
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
        header={params ? 'Update diagnosis' : 'Add diagnosis'}
      >
        <Formik
          validateOnMount
          validationSchema={object({
            name: schema.requireString('Name'),
            code: schema.requireString('Code'),
            description: schema.requireString('Description'),
          })}
          initialValues={{
            name: params?.name || '',
            code: params?.code || '',
            description: params?.description || '',
          }}
          onSubmit={(data, { setSubmitting, setErrors }) => {
            if (params) {
              api
                .updateDiagnosisService(data, params.id)
                .then(() => {
                  toast.success('Diagnosis updated');
                  setShow(false);
                  mutate();
                })
                .catch((error) => setErrors(error?.fields || {}))
                .finally(() => setSubmitting(false));
            }

            if (!params) {
              api
                .addDiagnosisService(data)
                .then(() => {
                  toast.success('Diagnosis added');
                  setShow(false);
                  mutate();
                })
                .catch((error) => setErrors(error?.fields || {}))
                .finally(() => setSubmitting(false));
            }
          }}
        >
          {({ isValid, isSubmitting }) => (
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
                  {params ? 'Update' : 'Add'} diagnosis
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
