import { Button, Field } from '@healthcareos/react';
import { Form, Formik } from 'formik';
import { schema } from '@healthcare/utils';
import { object } from 'yup';
import { useRef } from 'react';
import { toast } from 'react-toastify';
import Image from 'next/image';

import { updateProfileService } from '../../../services/settings';
import { UserModel } from '../../../models';
import { useStore } from '../../../hooks';

export default function Profile() {
  /**
   * store
   */
  const { store, setStore } = useStore();

  /**
   * ref
   */
  const imgRef = useRef<HTMLInputElement>();

  /**
   * variables
   */
  const user = store.user;

  return (
    <div className="max-w-[360px]">
      <Formik
        validateOnMount
        validationSchema={object({
          first_name: schema.requireString('First name'),
          last_name: schema.requireString('Last name'),
          email: schema.requireEmail('Email'),
          phone: schema.requirePhoneNumber('Phone number'),
          photo: schema.requireFile({
            field: 'Photo',
            required: false,
            type: ['image'],
          }),
        })}
        initialValues={{
          first_name: user?.first_name || '',
          last_name: user?.last_name || '',
          email: user?.email || '',
          phone: user?.phone || '',
          photo: {} as File,
        }}
        onSubmit={(
          { photo, ...params },
          { setSubmitting, setErrors, resetForm }
        ) => {
          const formData = new FormData();
          Object.keys(params).map((key) => formData.append(key, params[key]));

          if (photo?.name) formData.append('photo', photo);

          updateProfileService(formData)
            .then(({ user }: { user: UserModel }) => {
              setStore((store) => ({
                ...store,
                user: { ...store.user, ...user },
              }));
            })
            .catch((error) => {
              if (error?.fields) {
                return setErrors(error.fields);
              }

              toast.error(error?.message || 'Unable to update profile');
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
          <Form>
            <div
              role="button"
              className="w-[120px] h-[120px] rounded-full overflow-hidden mb-6"
              onClick={() => {
                imgRef?.current?.click();
              }}
            >
              <Image
                width={120}
                height={120}
                alt="profile"
                loading="lazy"
                src={
                  values.photo?.name
                    ? URL.createObjectURL(values.photo)
                    : user.photo || 'https://via.placeholder.com/150'
                }
                className="w-full h-full object-cover object-center"
              />

              <input
                type="file"
                ref={imgRef}
                accept="image/*"
                className="hidden"
                onChange={({ currentTarget: { files } }) => {
                  setFieldValue('photo', files?.[0]);
                }}
              />
            </div>

            <div className="mb-10">
              <Field.Group name="first_name" label="First name">
                <Field.Input name="first_name" value={values.first_name} />
              </Field.Group>

              <Field.Group name="last_name" label="Last name">
                <Field.Input name="last_name" value={values.last_name} />
              </Field.Group>

              <Field.Group name="email" label="Email">
                <Field.Input type="email" name="email" value={values.email} />
              </Field.Group>

              <Field.Group name="phone" label="Phone number">
                <Field.Phone
                  name="phone"
                  value={values.phone}
                  {...{ setFieldValue, setFieldTouched }}
                />
              </Field.Group>
            </div>

            <Button
              type="submit"
              disabled={!isValid}
              className="btn btn-primary"
              onClick={() => handleSubmit()}
              {...{ isSubmitting }}
            >
              Save changes
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
