import { ReactElement, useState } from 'react';
import { Form as BaseForm, Formik } from 'formik';
import { Button, Field, Modal } from '@healthcareos/react';
import { object } from 'yup';
import { helpers, schema } from '@healthcare/utils';
import { toast } from 'react-toastify';
import useSWR from 'swr/immutable';

import { MedicineCategoryModel, MedicineModel } from '../../../../../models';
import { useStore } from '../../../../../hooks';
import * as api from '../../../../../services/pharmacy';

export interface FormProps {
  mutate?: () => void;
  params?: MedicineModel;
  children: (props: { proceed: () => void }) => ReactElement;
}

function Form({ params, mutate, children }: FormProps) {
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
  const { data } = useSWR<{ categories: MedicineCategoryModel[] }>(
    show && `/medicine/category?per_page=1000`
  );

  /**
   * variables
   */
  const categories = data?.categories || [];

  return (
    <>
      {children({ proceed: () => setShow(true) })}
      <Modal
        show={show}
        onHide={() => setShow(false)}
        header={params ? 'Update Medicine' : 'Add Medicine'}
      >
        <Formik
          validateOnMount
          enableReinitialize
          validationSchema={object({
            name: schema.requireString('Name'),
            code: schema.requireString('Code'),
            unit: schema.requireString('Unit'),
            group: schema.requireString('Group'),
            category: schema.requireString('Category'),
            description: schema.requireString('Description'),
            minimum_level: schema.requireNumber('Minimum level'),
            reorder_level: schema.requireNumber('Reorder level'),
            cost_price: schema.requireNumber('Cost price'),
            regular_price: schema.requireNumber('Regular price'),
            nhis_price: schema.requireNumber('NHIS price'),
            private_price: schema.requireNumber('Private insurance price'),
          })}
          initialValues={{
            unit: params?.unit || '',
            name: params?.name || '',
            code: params?.code || '',
            group: params?.group || '',
            category: params?.category?.id || '',
            description: params?.description || '',
            minimum_level: params?.minimum_level || '',
            reorder_level: params?.reorder_level || '',
            cost_price: params?.cost_price || '',
            regular_price: params?.regular_price || '',
            nhis_price: params?.nhis_price || '',
            private_price: params?.private_price || '',
          }}
          onSubmit={(data, { setSubmitting, setErrors }) => {
            if (params) {
              api
                .updateMedicineService(data, params.id)
                .then(() => {
                  toast.success('Medicine updated');
                  setShow(false);
                  mutate?.();
                })
                .catch((error) => setErrors(error?.fields || {}))
                .finally(() => setSubmitting(false));
            }

            if (!params) {
              api
                .createMedicineService(data)
                .then(() => {
                  toast.success('Medicine created');
                  setShow(false);
                  mutate?.();
                })
                .catch((error) => setErrors(error?.fields || {}))
                .finally(() => setSubmitting(false));
            }
            return;
          }}
        >
          {({ values, isValid, isSubmitting, handleSubmit, setFieldValue }) => (
            <BaseForm>
              <div className="p-6">
                <Field.Group name="name" label="Name">
                  <Field.Input name="name" value={values.name} />
                </Field.Group>

                <Field.Group name="code" label="Code">
                  <Field.Input name="code" value={values.code} />
                </Field.Group>

                <Field.Group name="group" label="Group">
                  <Field.Input name="group" value={values.group} />
                </Field.Group>

                <Field.Group name="unit" label="Unit">
                  <Field.Select
                    name="unit"
                    value={values.unit}
                    options={helpers.medicineUnits}
                    onChange={({ value }: { value: string }) =>
                      setFieldValue('unit', value)
                    }
                  />
                </Field.Group>

                <Field.Group name="minimum_level" label="Minimum Level">
                  <Field.Input
                    type="number"
                    name="minimum_level"
                    placeholder="Minimum quantity of medicines that should always be available"
                    value={values.minimum_level}
                  />
                </Field.Group>

                <Field.Group name="reorder_level" label="Reorder Level">
                  <Field.Input
                    type="number"
                    name="reorder_level"
                    placeholder="Maximum quantity of medicines that can be reordered"
                    value={values.reorder_level}
                  />
                </Field.Group>

                <Field.Group name="category" label="Category">
                  <Field.Select
                    name="category"
                    value={values.category}
                    options={categories?.map((i) => ({
                      label: i.name,
                      value: i.id,
                    }))}
                    onChange={({ value }: { value: string }) =>
                      setFieldValue('category', value)
                    }
                  />
                </Field.Group>

                <Field.Group name="description" label="Description">
                  <Field.Input
                    as="textarea"
                    className="py-4"
                    name="description"
                    value={values.description}
                  />
                </Field.Group>

                <div>
                  <p className="text-lg mb-4 font-medium">Pricing</p>

                  <Field.Group
                    name="cost_price"
                    label="Cost price"
                    containerClassName="!px-4"
                  >
                    <span>{store.facility.currency_symbol}</span>
                    <Field.Input
                      name="cost_price"
                      className="!px-0"
                      value={values.cost_price}
                      placeholder="How much it cost you to purchase this medicine"
                    />
                  </Field.Group>

                  <Field.Group
                    name="nhis_price"
                    label="NHIS price"
                    containerClassName="!px-4"
                  >
                    <span>{store.facility.currency_symbol}</span>
                    <Field.Input
                      name="nhis_price"
                      className="!px-0"
                      value={values.nhis_price}
                      placeholder="How much you charge under NHIS insurance"
                    />
                  </Field.Group>

                  <Field.Group
                    name="private_price"
                    label="Private insurance price"
                    containerClassName="!px-4"
                  >
                    <span>{store.facility.currency_symbol}</span>
                    <Field.Input
                      name="private_price"
                      className="!px-0"
                      value={values.private_price}
                      placeholder="How much you charge under private insurance"
                    />
                  </Field.Group>

                  <Field.Group
                    name="regular_price"
                    label="Regular price"
                    containerClassName="!px-4"
                  >
                    <span>{store.facility.currency_symbol}</span>
                    <Field.Input
                      className="!px-0"
                      name="regular_price"
                      value={values.regular_price}
                      placeholder="How much you charge under no insurance"
                    />
                  </Field.Group>
                </div>
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
                  onClick={() => handleSubmit()}
                  {...{ isSubmitting }}
                >
                  {params ? 'Update medicine' : 'Add medicine'}
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
