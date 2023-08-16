import { debounce } from 'lodash';
import { Field } from '@healthcareos/react';
import { http } from '@healthcare/utils';
import AsyncSelect from 'react-select/async';
import queryString from 'query-string';

import { DiagnosisGDRDModel } from '../../../models';

export interface GDRGProps {
  isMulti?: boolean;
  value?: { label: string; value: string };
  onChange: (props: any) => void;
  disabled?: boolean;
}

function GDRG({ value, isMulti, disabled, onChange }: GDRGProps) {
  /**
   *
   * @param search
   * @param callback
   */
  const loadOptions = debounce(
    (search: string, callback: (options: any) => void) => {
      http
        .get<never, any>(
          `/gdrg?${queryString.stringify({
            search,
            page: 1,
            per_page: 30,
          })}`
        )
        .then(({ gdrgs }: { gdrgs: DiagnosisGDRDModel[] }) => {
          callback(
            gdrgs.map((i) => ({ label: `${i.name} (${i.code})`, value: i.id }))
          );
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
          return 'No GDRG matches your search query';
        } else {
          return 'Start typing to search for an GDRG';
        }
      }}
    />
  );
}

export default GDRG;
