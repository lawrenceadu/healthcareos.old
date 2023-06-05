import { useRef } from 'react';
import { Button, Field } from '@healthcareos/react';
import { Form, Formik } from 'formik';
import { schema } from '@healthcare/utils';
import { object } from 'yup';
import { toast } from 'react-toastify';
import Image from 'next/image';

import { updateFacilityService } from '../../../services/settings';
import { FacilityModel } from '../../../models';
import { useStore } from '../../../hooks';

function Company() {
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
  const facility = store.facility;

  return (
    <div className="max-w-[360px] w-full">
      <Formik
        validateOnMount
        validationSchema={object({
          name: schema.requireString('Name'),
          tagline: schema.requireString('Last name'),
          email: schema.requireEmail('Email'),
          phone: schema.requirePhoneNumber('Phone number'),
          logo: schema.requireFile({
            field: 'Logo',
            required: false,
            type: ['image'],
          }),
          address: schema.requireString('Address'),
          currency_code: schema.requireString('Currency code'),
          currency_symbol: schema.requireString('Currency symbol'),
        })}
        initialValues={{
          name: facility?.name || '',
          tagline: facility?.tagline || '',
          email: facility?.email || '',
          phone: facility?.phone || '',
          address: facility?.address || '',
          currency_code: facility?.currency_code || '',
          currency_symbol: facility?.currency_symbol || '',
          nhis_record_number: facility?.nhis_record_number || '',
          logo: {} as File,
        }}
        onSubmit={(
          { logo, ...params },
          { setSubmitting, setErrors, resetForm }
        ) => {
          const formData = new FormData();
          Object.keys(params).map((key) => formData.append(key, params[key]));

          if (logo?.name) formData.append('logo', logo);

          updateFacilityService(formData)
            .then(({ facility: _facility }: { facility: FacilityModel }) => {
              setStore((user) => ({
                ...user,
                facility: { ...user.facility, ..._facility },
              }));

              toast.success('Company information updated');
            })
            .catch((error) => {
              if (error?.message)
                toast.error(error?.message || 'Unable to update company info');

              if (error?.fields) setErrors(error?.fields);
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
                  values.logo?.name
                    ? URL.createObjectURL(values.logo)
                    : facility.logo || 'https://via.placeholder.com/150'
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
              <Field.Group name="name" label="Name">
                <Field.Input name="name" value={values.name} />
              </Field.Group>

              <Field.Group name="tagline" label="Last name">
                <Field.Input name="tagline" value={values.tagline} />
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

              <Field.Group name="address" label="Address">
                <Field.Input name="address" value={values.address} />
              </Field.Group>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <Field.Group
                  name="currency_code"
                  label="Currency code"
                  wrapperClassName="!mb-0"
                >
                  <Field.Input
                    name="currency_code"
                    value={values.currency_code}
                  />
                </Field.Group>

                <Field.Group
                  name="currency_symbol"
                  label="Currency symbol"
                  wrapperClassName="!mb-0"
                >
                  <Field.Input
                    name="currency_symbol"
                    value={values.currency_symbol}
                  />
                </Field.Group>
              </div>

              <Field.Group name="nhis_record_number" label="NHIS record number">
                <Field.Input
                  name="nhis_record_number"
                  value={values.nhis_record_number}
                />
              </Field.Group>
            </div>

            <Button
              type="submit"
              disabled={!isValid}
              className="btn btn-primary w-full"
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

export default Company;
