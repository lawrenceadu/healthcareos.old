import { useState } from 'react';
import { Button, Field, Modal } from '@healthcareos/react';
import { Form, Formik } from 'formik';
import { object } from 'yup';
import { schema } from '@healthcare/utils';

import { updateMemberService } from '../../../../../services/members';
import { UserModel } from '../../../../../models';

export interface EditProps {
  params: UserModel;
  children: (props: { proceed: () => void }) => void;
}

export default function Edit({
  params: { id, ...params },
  children,
}: EditProps) {
  /**
   * state
   */
  const [open, setOpen] = useState(false);

  return (
    <>
      {children({ proceed: () => setOpen(true) })}
      <Modal show={open} onHide={() => setOpen(false)} header="Edit role">
        <Formik
          validateOnMount
          validationSchema={object({
            name: schema.requireString('name'),
            role: schema.requireString('Role'),
          })}
          initialValues={{
            name: params.name,
            role: params.role,
          }}
          onSubmit={(params, { setSubmitting }) => {
            updateMemberService(params, String(id))
              .then(() => {
                setOpen(false);
              })
              .finally(() => setSubmitting(false));
          }}
        >
          {({
            values,
            isValid,
            isSubmitting,
            handleSubmit,
            setFieldValue,
            setFieldTouched,
          }) => (
            <Form className="">
              <div className="p-6">
                <Field.Group name="name" label="Name" disabled>
                  <Field.Input name="name" value={values.name} />
                </Field.Group>

                <Field.Group name="role" label="Role">
                  <Field.Select
                    name="role"
                    value={values.role}
                    options={[{ label: 'Doctor', value: 'doctor' }]}
                    placeholder="Select role"
                    onChange={({ value }: { value: string }) =>
                      setFieldValue('role', value)
                    }
                  />
                </Field.Group>
              </div>

              <div className="flex gap-6 justify-end py-3 px-6 border-t border-gray-200">
                <Button type="button" className="text-muted">
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={!isValid}
                  className="btn btn-primary"
                  {...{ isSubmitting }}
                >
                  Save changes
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </Modal>
    </>
  );
}
