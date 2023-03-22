import { ReactElement, useState } from 'react';
import { Form as BaseForm, Formik } from 'formik';
import { Button, Field, Modal } from '@healthcareos/react';
import { schema } from '@healthcare/utils';
import { object } from 'yup';
import { toast } from 'react-toastify';

import { DepartmentModel } from '../../../../models';
import * as api from '../../../../services/resource';
import SearchSelect from '../../../libs/SearchSelect';

export interface FormProps {
  mutate: () => void;
  params?: DepartmentModel;
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
        header={params ? 'Update department' : 'Add department'}
      >
        <Formik
          validateOnMount
          validationSchema={object({
            name: schema.requireString('Name'),
            description: schema.requireString('Description'),
            head: object().shape({
              label: schema.requireString('Head'),
              value: schema.requireString('Head'),
            }),
          })}
          initialValues={{
            name: params?.name || '',
            head: params?.head
              ? { label: params.head.name, value: params.head.id }
              : { label: '', value: '' },
            description: params?.description || '',
          }}
          onSubmit={(data, { setSubmitting, setErrors }) => {
            const _data = { ...data, head: data.head.value };

            if (params) {
              api
                .updateDepartmentService(_data, params.id)
                .then(() => {
                  toast.success('Department updated');
                  setShow(false);
                  mutate();
                })
                .catch((error) => setErrors(error?.fields || {}))
                .finally(() => setSubmitting(false));
            }

            if (!params) {
              api
                .addDepartmentService(_data)
                .then(() => {
                  toast.success('Department added');
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
                <Field.Group name="head.label" label="Head of department">
                  <SearchSelect.Users
                    value={values.head}
                    onChange={(value) => setFieldValue('head', value)}
                  />
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
                  {params ? 'Update' : 'Add'} department
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
