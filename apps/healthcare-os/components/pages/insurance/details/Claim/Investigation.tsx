import { Button, Field } from '@healthcareos/react';
import { DeleteIcon } from '@healthcare/icons';

import SearchSelect from '../../../../libs/SearchSelect';

export function InvestigationSelect({
  index,
  investigation,
  setFieldValue,
  onDelete,
}: {
  index: number;
  setFieldValue: any;
  onDelete: () => void;
  investigation: {
    id: string;
    name: string;
    submitted_at: string;
    reference: { id: string; name: string };
  };
}) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_3rem] items-center gap-4">
      <Field.Group
        label="Investigation"
        wrapperClassName="!mb-0"
        name={`investigation.${index}.id`}
        disabled={investigation.reference.name === 'request'}
      >
        <SearchSelect.Investigations
          disabled={investigation.reference.name === 'request'}
          value={{ label: investigation.name, value: investigation.id }}
          onChange={({ label, value }) => {
            setFieldValue(`investigation.${index}.id`, value);
            setFieldValue(`investigation.${index}.name`, label);
          }}
        />
      </Field.Group>

      <Field.Group
        label="Submitted date"
        wrapperClassName="!mb-0"
        name={`investigation.${index}.submitted`}
        disabled={investigation.reference.name === 'request'}
      >
        <Field.Date
          value={investigation.submitted_at}
          name={`investigation.${index}.submitted_at`}
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
