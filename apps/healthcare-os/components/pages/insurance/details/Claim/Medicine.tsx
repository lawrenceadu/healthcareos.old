import { Button, Field } from '@healthcareos/react';
import { DeleteIcon } from '@healthcare/icons';

import SearchSelect from '../../../../libs/SearchSelect';

export function MedicineSelect({
  index,
  medicine,
  setFieldValue,
  onDelete,
}: {
  index: number;
  setFieldValue: any;
  onDelete: () => void;
  medicine: {
    id: string;
    name: string;
    quantity: any;
    dispense_date: string;
    reference: { id: string; name: string };
  };
}) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_3rem] items-center gap-4">
      <Field.Group
        label="Medicine"
        wrapperClassName="!mb-0"
        name={`medicine.${index}.id`}
        disabled={medicine.reference.name === 'dispense'}
      >
        <SearchSelect.Medicines
          disabled={medicine.reference.name === 'dispense'}
          value={{ label: medicine.name, value: medicine.id }}
          onChange={({ label, value }) => {
            setFieldValue(`medicine.${index}.id`, value);
            setFieldValue(`medicine.${index}.name`, label);
          }}
        />
      </Field.Group>

      <Field.Group
        label="Quantity"
        wrapperClassName="!mb-0"
        name={`medicine.${index}.quantity`}
        disabled={medicine.reference.name === 'dispense'}
      >
        <Field.Input name={`medicine.${index}.quantity`} />
      </Field.Group>

      <Field.Group
        label="Dispense date"
        wrapperClassName="!mb-0"
        name={`medicine.${index}.dispense_date`}
        disabled={medicine.reference.name === 'dispense'}
      >
        <Field.Date
          name={`medicine.${index}.dispense_date`}
          value={medicine.dispense_date || ''}
          {...{ setFieldValue }}
        />
      </Field.Group>

      <div onClick={() => onDelete()}>
        <Button type="button">
          <DeleteIcon />
        </Button>
      </div>
    </div>
  );
}
