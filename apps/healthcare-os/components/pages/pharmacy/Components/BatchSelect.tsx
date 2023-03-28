import { helpers, schema } from '@healthcare/utils';
import { Button, Field } from '@healthcareos/react';
import { FormikHelpers } from 'formik';
import { DeleteIcon } from '@healthcare/icons';
import { object } from 'yup';
import { toast } from 'react-toastify';
import useSWR from 'swr';

import { MedicineModel } from '../../../../models';
import SearchSelect from '../../../libs/SearchSelect';

type MedicineType = {
  medicine: { label: string; value: string };
  batch_no: string;
  expiry_date: string;
  quantity: string | number;
};

export interface BatchSelectProps
  extends Pick<FormikHelpers<any>, 'setFieldValue' | 'setFieldTouched'> {
  id: string;
  index: number;
  remove: () => void;
  medicine: MedicineType;
  medicines: MedicineType[];
}

export function BatchSelect({
  id,
  index,
  remove,
  medicine,
  medicines,
  setFieldValue,
  setFieldTouched,
}: BatchSelectProps) {
  /**
   * api
   */
  const { data } = useSWR<{ medicine: MedicineModel }>(
    id && `/medicine/${id}`,
    null,
    { dedupingInterval: 1000 * 60 }
  );

  /**
   * variables
   */
  const medicineDetails = data?.medicine;

  return (
    <div className="grid gap-4 grid-cols-[minmax(0,1fr)_3rem]">
      <div
        className={helpers.classNames(
          'pb-6 border-b border-gray-200',
          'grid gap-4 md:grid-cols-2 xl:grid-cols-[400px_repeat(3,minmax(0,1fr))]'
        )}
      >
        <Field.Group
          label="Medicine"
          wrapperClassName="!mb-0"
          name={`medicines.${index}.medicine.label`}
        >
          <SearchSelect.Medicines
            value={medicine?.medicine}
            onChange={(value) => {
              if (medicines.find((i) => i.medicine?.value === value.value)) {
                toast.error('Medicine already exist in list');
              } else {
                setFieldValue(`medicines.${index}.medicine`, value);
              }
            }}
          />
        </Field.Group>

        <Field.Group
          label="Batch no."
          wrapperClassName="!mb-0"
          name={`medicines.${index}.batch_no`}
        >
          <Field.Select
            name={`medicines.${index}.batch_no`}
            value={medicine?.batch_no}
            onChange={(i) => {
              setFieldValue(`medicines.${index}.batch_no`, i.value); // prettier-ignore
              setFieldValue(`medicines.${index}.expiry_date`, i.stock.expiry_date) // prettier-ignore
            }}
            options={
              medicineDetails?.stocks?.map((i) => ({
                label: i.batch_no,
                value: i.batch_no,
                stock: i,
              })) || []
            }
          />
        </Field.Group>

        <Field.Group
          disabled
          label="Expiry"
          wrapperClassName="!mb-0"
          name={`medicines.${index}.expiry_date`}
        >
          <Field.Date
            value={medicine.expiry_date || ''}
            name={`medicines.${index}.expiry_date`}
            {...{ setFieldValue, setFieldTouched }}
          />
        </Field.Group>

        <Field.Group
          label="Quantity"
          name={`medicines.${index}.quantity`}
          containerClassName="overflow-hidden"
        >
          <Field.Input type="number" name={`medicines.${index}.quantity`} />
        </Field.Group>
      </div>
      <Button
        type="button"
        aria-label="Delete"
        className="!px-0 mt-6 w-full"
        onClick={() => remove()}
      >
        <DeleteIcon />
      </Button>
    </div>
  );
}

export const medicinesSchema = schema.requireArray('Medicines').of(
  object().shape({
    expiry_date: schema.requireString('Expiry date'),
    quantity: schema.requireNumber('Quantity'),
    batch_no: schema.requireString('Batch no'),
    medicine: object().shape({
      label: schema.requireString('Medicine'),
      value: schema.requireString('Medicine'),
    }),
  })
);

export default BatchSelect;
