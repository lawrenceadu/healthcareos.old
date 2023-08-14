import { ReactElement, useState } from 'react';
import { Form as BaseForm, Formik } from 'formik';
import { Button, Field, Modal } from '@healthcareos/react';
import { object } from 'yup';
import { schema } from '@healthcare/utils';
import { toast } from 'react-toastify';

import * as api from '../../../../../services/inventory';

type ParamsProps = {
  id: string;
  name: string;
  code: string;
  description: string;
};

export interface FormProps {
  mutate?: () => void;
  params?: ParamsProps;
  children: (props: { proceed: () => void }) => ReactElement;
}

function Form({ params, mutate, children }: FormProps) {
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
        header={params ? 'Update Category' : 'Add Category'}
      >
        <Formik
          validateOnMount
          enableReinitialize
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
                .updateItemCategoryService(data, params.id)
                .then(() => {
                  toast.success('Item category updated');
                  setShow(false);
                  mutate?.();
                })
                .catch((error) => setErrors(error?.fields || {}))
                .finally(() => setSubmitting(false));
            }

            if (!params) {
              api
                .createItemCategoryService(data)
                .then(() => {
                  toast.success('Item category created');
                  setShow(false);
                  mutate?.();
                })
                .catch((error) => setErrors(error?.fields || {}))
                .finally(() => setSubmitting(false));
            }
            return;
          }}
        >
          {({ values, isValid, isSubmitting, handleSubmit }) => (
            <BaseForm>
              <div className="p-6">
                <Field.Group name="name" label="Name">
                  <Field.Input name="name" value={values.name} />
                </Field.Group>

                <Field.Group name="code" label="Code">
                  <Field.Input name="code" value={values.code} />
                </Field.Group>

                <Field.Group name="description" label="Description">
                  <Field.Input
                    as="textarea"
                    className="py-4"
                    name="description"
                    value={values.description}
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
                  {params ? 'Update category' : 'Add category'}
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
