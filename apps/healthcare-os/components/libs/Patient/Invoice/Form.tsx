import { Form as BaseForm, FieldArray, FormikProps } from 'formik';
import { DeleteIcon, PlusIcon } from '@healthcare/icons';
import { helpers, schema } from '@healthcare/utils';
import { Button, Field } from '@healthcareos/react';
import { object } from 'yup';

import { usePatient, useStore } from '../../../../hooks';
import { ChargeModel } from '../../../../models';
import SearchSelect from '../../SearchSelect';

export const validationSchema = object({
  notes: schema.requireString('Notes', false),
  charges: schema.requireArray('Charges').of(
    object().shape({
      charge: object().shape({
        label: schema.requireString('Charge'),
        value: schema.requireString('Charge'),
      }),
      department: object().shape({
        label: schema.requireString('Department'),
        value: schema.requireString('Department'),
      }),
      quantity: schema.requireNumber('Quantity'),
      description: schema.requireString('Description', false),
    })
  ),
});

function Form({
  values,
  children,
  setFieldValue,
}: Partial<
  FormikProps<{
    charges: {
      charge: { label: string; value: string; charge?: ChargeModel };
      department: { label: string; value: string };
      quantity: number;
      description: string;
    }[];
    insurance: boolean;
    notes: string;
    status: string;
  }>
> & { children: any }) {
  /**
   * hook
   */
  const { patient } = usePatient();
  const { store } = useStore();

  /**
   * functions
   */
  const handleCalculateAmount = (params: typeof values) => {
    const insurance_type =
      params.insurance &&
      patient.insurances.length &&
      patient.insurances[0].type;

    const amounts = params.charges.map((i) => {
      if (i.charge.charge && i.quantity) {
        if (insurance_type) {
          return (
            (insurance_type === 'private'
              ? i.charge.charge.private_price
              : i.charge.charge.nhis_price) * i.quantity
          );
        } else {
          return i.charge.charge.regular_price * i.quantity;
        }
      } else {
        return 0;
      }
    });

    return amounts.reduce((a, b) => a + b, 0).toFixed(2);
  };

  return (
    <BaseForm>
      <div className="mx-6 py-6 mb-6 border-b border-gray-200">
        <p className="text-xl mb-4 font-bold">Items</p>
        <FieldArray name="items">
          {(helper) => (
            <>
              <div className="grid gap-4">
                {values.charges.map((charge, key) => (
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
                          name={`charges.${key}.charge.label`}
                          wrapperClassName="!mb-0"
                        >
                          <SearchSelect.Charges
                            value={charge.charge}
                            onChange={(value) =>
                              setFieldValue(`charges.${key}.charge`, value)
                            }
                          />
                        </Field.Group>

                        <Field.Group
                          label="Revenue dept"
                          name={`charges.${key}.department`}
                          wrapperClassName="!mb-0"
                        >
                          <SearchSelect.Departments
                            value={charge.department}
                            onChange={(value) =>
                              setFieldValue(`charges.${key}.department`, value)
                            }
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
                            name={`charges.${key}.quantity`}
                            value={charge.quantity}
                          />
                        </Field.Group>

                        <Field.Group
                          disabled
                          label="Price"
                          wrapperClassName="!mb-0"
                          name={`items.${key}.price`}
                        >
                          <span className="pl-4">
                            {store.facility.currency_symbol}
                          </span>
                          <Field.Input
                            type="number"
                            value={(() => {
                              if (charge.charge?.charge) {
                                if (values.insurance) {
                                  const insurance = patient.insurances?.[0];
                                  if (insurance.type === 'nhis') {
                                    return (
                                      charge.charge?.charge?.nhis_price || 0
                                    );
                                  } else {
                                    return (
                                      charge.charge?.charge?.private_price || 0
                                    );
                                  }
                                } else {
                                  return (
                                    charge.charge?.charge?.regular_price || 0
                                  );
                                }
                              } else {
                                return 0;
                              }
                            })()}
                            name={`items.${key}.price`}
                          />
                        </Field.Group>
                      </div>
                    </div>
                    {key !== 0 && (
                      <Button
                        type="button"
                        className="mt-6 !px-0 w-full"
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

      {!!patient?.insurances?.length && (
        <div className="mb-8 px-6">
          <Field.Toggle
            name="insurance"
            checked={values.insurance}
            onChange={(checked) => setFieldValue('insurance', checked)}
          >
            <p className="ml-4">Apply insurance</p>
          </Field.Toggle>
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
          <p className="font-semibold">
            Total:{' '}
            {store.facility.currency_symbol +
              ' ' +
              handleCalculateAmount(values)}
          </p>
        </div>
        <div className="flex gap-4">{children}</div>
      </div>
    </BaseForm>
  );
}

export default Form;
