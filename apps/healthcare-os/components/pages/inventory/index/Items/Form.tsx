import { ReactElement, useState } from 'react';
import { Form as BaseForm, Formik } from 'formik';
import { Button, Field, Modal } from '@healthcareos/react';
import { object } from 'yup';
import { schema } from '@healthcare/utils';
import { toast } from 'react-toastify';
import useSWR from 'swr/immutable';

import { ItemCategoryModel, ItemModel } from '../../../../../models';
import * as api from '../../../../../services/inventory';

export interface FormProps {
  mutate?: () => void;
  params?: ItemModel;
  children: (props: { proceed: () => void }) => ReactElement;
}

function Form({ params, mutate, children }: FormProps) {
  /**
   * state
   */
  const [show, setShow] = useState(false);

  /**
   * api
   */
  const { data } = useSWR<{ categories: ItemCategoryModel[] }>(
    show && `/item/category?per_page=1000`
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
        header={params ? 'Update Item' : 'Add Item'}
      >
        <div className="max-h-[600px] overflow-y-auto">
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
            }}
            onSubmit={(data, { setSubmitting, setErrors }) => {
              if (params) {
                api
                  .updateItemService(data, params.id)
                  .then(() => {
                    toast.success('Item updated');
                    setShow(false);
                    mutate?.();
                  })
                  .catch((error) => setErrors(error?.fields || {}))
                  .finally(() => setSubmitting(false));
              }

              if (!params) {
                api
                  .createItemService(data)
                  .then(() => {
                    toast.success('Item created');
                    setShow(false);
                    mutate?.();
                  })
                  .catch((error) => setErrors(error?.fields || {}))
                  .finally(() => setSubmitting(false));
              }
              return;
            }}
          >
            {({
              values,
              isValid,
              isSubmitting,
              handleSubmit,
              setFieldValue,
            }) => (
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
                    <Field.Input name="unit" value={values.unit} />
                  </Field.Group>

                  <Field.Group name="minimum_level" label="Minimum Level">
                    <Field.Input
                      type="number"
                      name="minimum_level"
                      value={values.minimum_level}
                    />
                  </Field.Group>

                  <Field.Group name="reorder_level" label="Reorder Level">
                    <Field.Input
                      type="number"
                      name="reorder_level"
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
                    {params ? 'Update item' : 'Add item'}
                  </Button>
                </div>
              </BaseForm>
            )}
          </Formik>
        </div>
      </Modal>
    </>
  );
}

export default Form;
