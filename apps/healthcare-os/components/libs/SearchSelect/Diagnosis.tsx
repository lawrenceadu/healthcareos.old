import { debounce } from 'lodash';
import { Field } from '@healthcareos/react';
import { http } from '@healthcare/utils';
import AsyncSelect from 'react-select/async';
import queryString from 'query-string';

import { DiagnosisModel } from '../../../models';

export interface DiagnosisProps {
  value?: { label: string; value: string };
  options?: [{ label: string; value: string }];
  onChange: (props: any) => void;
}

function Diagnosis({ value, options, onChange }: DiagnosisProps) {
  /**
   *
   * @param search
   * @param callback
   */
  const loadOptions = debounce(
    (search: string, callback: (options: any) => void) => {
      http
        .get<never, any>(`/diagnosis?${queryString.stringify({ search })}`)
        .then(({ diagnoses }: { diagnoses: DiagnosisModel[] }) => {
          callback(diagnoses.map((i) => ({ label: i.name, value: i.id })));
        });
    },
    500
  );

  return (
    <AsyncSelect
      cacheOptions
      value={value}
      loadOptions={loadOptions}
      styles={Field.Select.Components.styles}
      placeholder="Start typing to search for a diagnosis"
      components={{ ...Field.Select.Components }}
      onChange={onChange}
    />
  );
}

export default Diagnosis;
