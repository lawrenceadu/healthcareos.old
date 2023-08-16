import { debounce } from 'lodash';
import { Field } from '@healthcareos/react';
import { http } from '@healthcare/utils';
import AsyncSelect from 'react-select/async';
import queryString from 'query-string';

import { DiagnosisModel } from '../../../models';

export interface DiagnosisProps {
  isMulti?: boolean;
  value?: { label: string; value: string };
  onChange: (props: any) => void;
  disabled?: boolean;
}

function Diagnosis({ value, isMulti, disabled, onChange }: DiagnosisProps) {
  /**
   *
   * @param search
   * @param callback
   */
  const loadOptions = debounce(
    (search: string, callback: (options: any) => void) => {
      http
        .get<never, any>(
          `/diagnosis?${queryString.stringify({
            search,
            page: 1,
            per_page: 30,
          })}`
        )
        .then(({ diagnoses }: { diagnoses: DiagnosisModel[] }) => {
          callback(diagnoses.map((i) => ({ label: i.name, value: i.id })));
        });
    },
    500
  );

  return (
    <AsyncSelect
      cacheOptions
      defaultOptions
      value={value}
      placeholder=""
      isMulti={isMulti}
      onChange={onChange}
      isDisabled={disabled}
      loadOptions={loadOptions}
      styles={Field.Select.Components.styles}
      components={{ ...Field.Select.Components }}
      noOptionsMessage={({ inputValue }) => {
        if (inputValue) {
          return 'No diagnosis matches your search query';
        } else {
          return 'Start typing to search for a diagnosis';
        }
      }}
    />
  );
}

export default Diagnosis;
