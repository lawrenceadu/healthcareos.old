import { Button, Field } from '@healthcareos/react';
import { DeleteIcon } from '@healthcare/icons';
import useSWR from 'swr';

import { DiagnosisGDRDModel, DiagnosisModel } from '../../../../../models';
import SearchSelect from '../../../../libs/SearchSelect';

export function DiagnosesSelect({
  index,
  diagnosis,
  setFieldValue,
  onDelete,
}: {
  index: number;
  setFieldValue: any;
  onDelete: () => void;
  diagnosis: {
    id: string;
    name: string;
    code: string;
    gdrg: { id: string; name: string };
  };
}) {
  /**
   * api
   */
  const { data } = useSWR<{ diagnosis: DiagnosisModel }>(
    diagnosis?.id && `/diagnosis/${diagnosis.id}`
  );

  /**
   * variables
   */
  const gdrgs = (data?.diagnosis?.gdrg as DiagnosisGDRDModel[]) || [];

  return (
    <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_3rem] items-center gap-4">
      <Field.Group
        label="Diagnosis"
        wrapperClassName="!mb-0"
        name={`diagnosis.${index}.id`}
      >
        <SearchSelect.Diagnosis
          value={{ label: diagnosis.name, value: diagnosis.id }}
          onChange={({ label, value, code }) =>
            setFieldValue(`diagnosis.${index}`, {
              id: value,
              name: label,
              code,
            })
          }
        />
      </Field.Group>

      <Field.Group
        label="GDRG"
        wrapperClassName="!mb-0"
        name={`diagnosis.${index}.gdrg`}
      >
        <Field.Select
          placeholder="Select gdrg"
          value={diagnosis?.gdrg?.id || ''}
          options={
            gdrgs?.map((i) => ({
              label: `${i.name} (${i.code})`,
              value: i.id,
              name: i.name,
            })) || []
          }
          onChange={({ value, name }) =>
            setFieldValue(`diagnosis.${index}.gdrg`, { id: value, name })
          }
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
