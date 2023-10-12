import { Button, Field } from '@healthcareos/react';
import { DeleteIcon } from '@healthcare/icons';

import SearchSelect from '../../../../libs/SearchSelect';

export function ProcedureSelect({
  index,
  procedure,
  setFieldValue,
  onDelete,
}: {
  index: number;
  setFieldValue: any;
  onDelete: () => void;
  procedure: {
    id: string;
    name: string;
    execution_date: string;
    diagnosis: { id: string; name: string };
    reference: { id: string; name: string };
  };
}) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_3rem] items-center gap-4">
      <Field.Group
        label="Procedure"
        wrapperClassName="!mb-0"
        name={`procedure.${index}.id`}
        disabled={procedure.reference.name === 'request'}
      >
        <SearchSelect.Procedures
          disabled={procedure.reference.name === 'request'}
          value={{ label: procedure.name, value: procedure.id }}
          onChange={({ label, value }) => {
            setFieldValue(`procedure.${index}.id`, value);
            setFieldValue(`procedure.${index}.name`, label);
          }}
        />
      </Field.Group>

      <Field.Group
        label="Diagnosis"
        wrapperClassName="!mb-0"
        name={`procedure.${index}.diagnosis.id`}
        disabled={procedure.reference.name === 'request'}
      >
        <SearchSelect.Diagnosis
          disabled={procedure.reference.name === 'request'}
          value={{
            label: procedure.diagnosis.name,
            value: procedure.diagnosis.id,
          }}
          onChange={({ label, value }) => {
            setFieldValue(`procedure.${index}.diagnosis.id`, value);
            setFieldValue(`procedure.${index}.diagnosis.name`, label);
          }}
        />
      </Field.Group>

      <Field.Group
        label="Execution date"
        wrapperClassName="!mb-0"
        name={`procedure.${index}.execution_date`}
        disabled={procedure.reference.name === 'request'}
      >
        <Field.Date
          value={procedure.execution_date}
          name={`procedure.${index}.execution_date`}
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
