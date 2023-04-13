import { ReactElement, useState } from 'react';
import { Formik, Form as BaseForm } from 'formik';
import { Button, Field, Modal } from '@healthcareos/react';
import { schema } from '@healthcare/utils';
import { object } from 'yup';
import { toast } from 'react-toastify';
import useSWR from 'swr';

import { updateRoleService, createRoleService } from '../../../../../services/members'; // prettier-ignore
import { RoleModel } from '../../../../../models';
import { useStore } from '../../../../../hooks';

export interface FormProps {
  mutate: () => void;
  params?: RoleModel;
  children: (props: { proceed: () => void }) => ReactElement;
}

function Form({ children, mutate, params }: FormProps) {
  /**
   * state
   */
  const [show, setShow] = useState(false);

  /**
   * store
   */
  const { store } = useStore();

  /**
   * api
   */
  const { data: roleData } = useSWR<{ role: RoleModel }>(
    params?.id && show && `/role/${params.id}`
  );

  return (
    <>
      {children({ proceed: () => setShow(true) })}

      <Modal
        show={show}
        onHide={() => setShow(false)}
        header={params ? 'Update role' : 'Add role'}
      >
        <Formik
          validateOnMount
          validationSchema={object({
            name: schema.requireString('Name'),
            code: schema.requireString('Code'),
          })}
          initialValues={{
            name: params?.name || '',
            code: params?.code || '',
          }}
          onSubmit={(data, { setSubmitting, setErrors }) => {
            const _data = { ...data, default: 0, active: 1 };

            if (!params) {
              createRoleService(_data)
                .then(() => {
                  toast.success('Role added');
                  setShow(false);
                  mutate();
                })
                .catch((error) => setErrors(error?.fields || {}))
                .finally(() => setSubmitting(false));
            }

            if (params) {
              updateRoleService(_data, params.id)
                .then(() => {
                  toast.success('Role updated');
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
              </div>
              <div className="modal-footer">
                <Button
                  type="button"
                  onClick={() => setShow(false)}
                  className="btn-light"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={!isValid}
                  className="btn btn-primary"
                  {...{ isSubmitting }}
                >
                  {params ? 'Update role' : 'Add role'}
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
