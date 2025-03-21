import { Button, Field } from '@healthcareos/react';
import { Form, Formik } from 'formik';
import { object } from 'yup';
import { schema } from '@healthcare/utils';

import { inviteMemberService } from '../../../../../../services/members';
import { useRoles } from '../../../../../../hooks';
import { toast } from 'react-toastify';

export interface AddProps {
  onHide: () => void;
  mutate: () => void;
}

function Add({ onHide, mutate }: AddProps) {
  /**
   * hooks
   */
  const roles = useRoles();

  return (
    <Formik
      validateOnMount
      validationSchema={object({
        email: schema.requireEmail('Email'),
        role: schema.requireString('Role'),
        phone: schema.requirePhoneNumber('Phone'),
      })}
      initialValues={{
        email: '',
        role: '',
        phone: '',
      }}
      onSubmit={(params, { setSubmitting, setErrors }) => {
        inviteMemberService({ ...params, active: 1 })
          .then(() => {
            toast.success('Invitation sent');
            mutate?.();
            onHide?.();
          })
          .catch((error) => setErrors(error?.fields || {}))
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
          <div className="px-6 mb-6">
            <Field.Group name="email" label="Email">
              <Field.Input
                type="email"
                name="email"
                placeholder="Enter email address"
              />
            </Field.Group>

            <Field.Group name="phone" label="Phone number">
              <Field.Phone
                name="phone"
                value={values.phone}
                {...{ setFieldValue, setFieldTouched }}
              />
            </Field.Group>

            <Field.Group name="role" label="Role">
              <Field.Select
                name="role"
                value={values.role}
                options={roles.map((i) => ({ label: i.name, value: i.id }))}
                placeholder="Select role"
                onChange={({ value }: { value: string }) =>
                  setFieldValue('role', value)
                }
              />
            </Field.Group>
          </div>

          <div className="modal-footer">
            <Button type="button" className="text-muted">
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!isValid}
              className="btn btn-primary"
              {...{ isSubmitting }}
            >
              Send invite
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}

export default Add;
