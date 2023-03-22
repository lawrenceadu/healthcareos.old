import { ReactElement, useState } from 'react';
import { Form as BaseForm, Formik } from 'formik';
import { Button, Field, Modal } from '@healthcareos/react';
import { schema } from '@healthcare/utils';
import { object } from 'yup';
import { toast } from 'react-toastify';

import { TriageModel } from '../../../../models';
import * as api from '../../../../services/resource';

export interface FormProps {
  mutate: () => void;
  params?: TriageModel;
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
        header={params ? 'Update triage' : 'Add triage'}
      >
        <Formik
          validateOnMount
          validationSchema={object({
            name: schema.requireString('Name'),
            code: schema.requireString('Code'),
            colour: schema.requireString('Colour'),
            description: schema.requireString('Description'),
          })}
          initialValues={{
            name: params?.name || '',
            code: params?.code || '',
            colour: params?.colour || '',
            description: params?.description || '',
          }}
          onSubmit={(data, { setSubmitting, setErrors }) => {
            if (params) {
              api
                .updateTriageService(data, params.id)
                .then(() => {
                  toast.success('Triage updated');
                  setShow(false);
                  mutate();
                })
                .catch((error) => setErrors(error?.fields || {}))
                .finally(() => setSubmitting(false));
            }

            if (!params) {
              api
                .addTriageService(data)
                .then(() => {
                  toast.success('Triage added');
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

                <Field.Group name="colour" label="Colour">
                  <Field.Input type="color" name="colour" />
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
                  {params ? 'Update' : 'Add'} triage
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
