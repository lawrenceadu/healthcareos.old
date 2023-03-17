import { useState } from 'react';
import { Button, Field, Modal } from '@healthcareos/react';
import { Form, Formik } from 'formik';
import { object } from 'yup';
import { schema } from '@healthcare/utils';
import { toast } from 'react-toastify';

import { updateLocationService } from '../../../../services/settings';
import { LocationModel } from '../../../../models';

export interface EditProps {
  mutate: () => void;
  location?: LocationModel;
  children: (props: { proceed: () => void }) => void;
}

function Edit({ mutate, children, location }: EditProps) {
  /**
   * state
   */
  const [show, setShow] = useState(false);

  return (
    <>
      {children({ proceed: () => setShow(true) })}

      <Modal show={show} onHide={() => setShow(false)} header="Edit location">
        <Formik
          validateOnMount
          validationSchema={object({
            name: schema.requireString('Name'),
            type: schema.requireString('Type'),
          })}
          initialValues={{
            name: location?.name || '',
            type: location?.type || '',
          }}
          onSubmit={(params, { setSubmitting, setErrors }) => {
            updateLocationService(params, location.id)
              .then(() => {
                toast.success('Location update');
                setShow(false);
                mutate?.();
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
            <Form>
              <div className="p-6">
                <Field.Group name="name" label="Name of location">
                  <Field.Input name="name" value={values.name} />
                </Field.Group>

                <Field.Group name="type" label="Type of location">
                  <Field.Input name="type" value={values.type} />
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

export default Edit;
