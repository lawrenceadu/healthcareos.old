import { DeleteIcon, PlusIcon, SaveIcon } from '@healthcare/icons';
import { Form as BaseForm, FieldArray, FormikProps } from 'formik';
import { Button, Field } from '@healthcareos/react';
import { helpers } from '@healthcare/utils';

function Form({
  values,
  children,
  setFieldValue,
}: Partial<
  FormikProps<{
    patient_type: string;
    items: {
      item: string;
      department: string;
      quantity: number;
      price: number;
    }[];
    insurance: { name: string; number: string; amount: number };
    apply_insurance: boolean;
  }>
> & { children: any }) {
  return (
    <BaseForm>
      <div className="mx-6 py-6 border-b border-gray-200">
        <p className="mb-4">What type of patient is this patient?</p>

        <div className="flex gap-6">
          {[
            { label: 'Outpatient', value: 'outpatient' },
            { label: 'Inpatient', value: 'inpatient' },
          ].map((i, key) => (
            <Field.Radio name="patient_type" value={i.value} key={key}>
              {i.label}
            </Field.Radio>
          ))}
        </div>
      </div>
      <div className="mx-6 py-6 border-b border-gray-200">
        <p className="text-xl mb-4 font-bold">Items</p>
        <FieldArray name="items">
          {(helper) => (
            <>
              <div className="grid gap-4">
                {values.items.map((item, key) => (
                  <div
                    key={key}
                    className={helpers.classNames(
                      'grid gap-2 md:grid-cols-[minmax(0,1fr),3rem]'
                    )}
                  >
                    <div
                      className={helpers.classNames(
                        'grid gap-4 md:grid md:grid-cols-2'
                      )}
                    >
                      <div className="grid gap-4 grid-cols-2">
                        <Field.Group
                          label="Item"
                          name={`items.${key}.item`}
                          wrapperClassName="!mb-0"
                        >
                          <Field.Select
                            value={item.item}
                            name={`items.${key}.item`}
                            onChange={({ value }: { value: string }) => {
                              setFieldValue(`items.${key}.item`, value);
                              setFieldValue(`items.${key}.price`, 13);
                            }}
                            options={[
                              {
                                label: 'Registration',
                                value: 'registration',
                              },
                            ]}
                          />
                        </Field.Group>
                        <Field.Group
                          label="Revenue dept"
                          name={`items.${key}.department`}
                          wrapperClassName="!mb-0"
                        >
                          <Field.Select
                            value={item.department}
                            name={`items.${key}.department`}
                            onChange={({ value }: { value: string }) =>
                              setFieldValue(`items.${key}.department`, value)
                            }
                            options={[
                              {
                                label: 'Pharmacy',
                                value: 'pharmacy',
                              },
                            ]}
                          />
                        </Field.Group>
                      </div>
                      <div className="grid gap-4 md:grid-cols-2">
                        <Field.Group
                          label="Quantity"
                          wrapperClassName="!mb-0"
                          name={`items.${key}.quantity`}
                        >
                          <Field.Input
                            type="number"
                            name={`items.${key}.quantity`}
                            value={item.quantity}
                          />
                        </Field.Group>

                        <Field.Group
                          disabled
                          label="Price"
                          wrapperClassName="!mb-0"
                          name={`items.${key}.price`}
                        >
                          <span className="pl-4">GHS</span>
                          <Field.Input
                            type="number"
                            value={item.price || ''}
                            name={`items.${key}.price`}
                          />
                        </Field.Group>
                      </div>
                    </div>
                    {key !== 0 && (
                      <Button
                        className="text-red-600 mt-6"
                        onClick={() => helper.remove(key)}
                      >
                        <DeleteIcon />
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              <Button
                type="button"
                className="btn-light mt-2"
                onClick={() =>
                  helper.push({
                    item: '',
                    department: '',
                    quantity: 1,
                    price: 0,
                  })
                }
              >
                <PlusIcon className="stroke-[2.5px]" />
                <span>Add item</span>
              </Button>
            </>
          )}
        </FieldArray>
      </div>

      {values.apply_insurance ? (
        <div className="p-6 mb-10">
          <p className="text-xl font-bold mb-4">Insurance</p>

          <div className="grid md:gap-4 md:grid-cols-[repeat(3,minmax(0,1fr))_3rem]">
            <Field.Group
              disabled
              name="insurance.name"
              label="Insurance name"
              wrapperClassName="!mb-0"
            >
              <Field.Input
                name="insurance.name"
                value={values.insurance.name}
              />
            </Field.Group>

            <Field.Group
              disabled
              name="insurance.number"
              label="Membership number"
              wrapperClassName="!mb-0"
            >
              <Field.Input
                name="insurance.number"
                value={values.insurance.number}
              />
            </Field.Group>

            <Field.Group
              label="Amount"
              name="insurance.amount"
              wrapperClassName="!mb-0"
            >
              <span className="pl-4">GHS</span>
              <Field.Input
                type="number"
                name="insurance.amount"
                value={values.insurance.amount || ''}
              />
            </Field.Group>
            <Button
              type="button"
              className="mt-6 text-red-600"
              onClick={() => setFieldValue('apply_insurance', false)}
            >
              <DeleteIcon />
            </Button>
          </div>
        </div>
      ) : (
        <div className="p-6">
          <Button
            type="button"
            className="btn-outline"
            onClick={() => setFieldValue('apply_insurance', true)}
          >
            Apply insurance
          </Button>
        </div>
      )}

      <div
        className={helpers.classNames(
          'p-6 bg-gray-50',
          'md:flex md:flex-col md:gap-4',
          'lg:flex lg:flex-row lg:items-center lg:justify-between'
        )}
      >
        <div className="flex gap-4 flex-col md:flex-row md:gap-6">
          <p>
            Total: Ghs{' '}
            {values.items.reduce((a, b) => a + Number(b.price * b.quantity), 0)}
          </p>
          <p>Insurance: Ghs {values.insurance.amount || 0}</p>
          <p className="font-bold">
            Balance: Ghs{' '}
            {values.items.reduce(
              (a, b) => a + Number(b.price * b.quantity),
              0
            ) - (values.insurance.amount || 0)}
          </p>
        </div>
        <div className="flex gap-4">{children}</div>
      </div>
    </BaseForm>
  );
}

export default Form;
