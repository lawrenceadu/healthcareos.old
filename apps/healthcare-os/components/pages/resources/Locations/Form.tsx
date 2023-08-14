import { ReactElement, useState } from 'react';
import { Form as BaseForm, Formik } from 'formik';
import { Button, Field, Modal } from '@healthcareos/react';
import { schema } from '@healthcare/utils';
import { object } from 'yup';
import { toast } from 'react-toastify';
import useSWR from 'swr';

import { DepartmentModel, LocationModel } from '../../../../models';
import * as api from '../../../../services/resource';

export interface FormProps {
  mutate: () => void;
  params?: LocationModel;
  children: (props: { proceed: () => void }) => ReactElement;
}

function Form({ mutate, children, params }: FormProps) {
  /**
   * state
   */
  const [show, setShow] = useState(false);

  /**
   * api
   */
  const { data } = useSWR<{ departments: DepartmentModel[] }>(`/department`);

  /**
   * variables
   */
  const departments = data?.departments || [];

  return (
    <>
      {children({ proceed: () => setShow(true) })}

      <Modal
        show={show}
        onHide={() => setShow(false)}
        header={params ? 'Update location' : 'Add location'}
      >
        <Formik
          validateOnMount
          validationSchema={object({
            name: schema.requireString('Name'),
            type: schema.requireString('Type'),
            department: schema.requireString('Department'),
          })}
          initialValues={{
            name: params?.name || '',
            type: params?.type || '',
            department: params?.department?.id || '',
          }}
          onSubmit={(data, { setSubmitting, setErrors }) => {
            if (params) {
              api
                .updateLocationService(data, params.id)
                .then(() => {
                  toast.success('Location updated');
                  setShow(false);
                  mutate();
                })
                .catch((error) => setErrors(error?.fields || {}))
                .finally(() => setSubmitting(false));
            }

            if (!params) {
              api
                .addLocationService(data)
                .then(() => {
                  toast.success('Location added');
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
                  <Field.Input name="name" placeholder="Pharmacy Annex" />
                </Field.Group>

                <Field.Group name="type" label="Type">
                  <Field.Input name="type" placeholder="eg. pharmacy" />
                </Field.Group>

                <Field.Group name="department" label="Department">
                  <Field.Select
                    value={values.department}
                    onChange={({ value }: { value: string }) =>
                      setFieldValue('department', value)
                    }
                    options={
                      departments?.map((i) => ({
                        label: i.name,
                        value: i.id,
                      })) || []
                    }
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
                  {params ? 'Update' : 'Add'} location
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
