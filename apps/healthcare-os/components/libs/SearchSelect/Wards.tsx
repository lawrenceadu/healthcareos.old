import { debounce } from 'lodash';
import { Field } from '@healthcareos/react';
import { http } from '@healthcare/utils';
import AsyncSelect from 'react-select/async';
import queryString from 'query-string';

import { WardModel } from '../../../models';

export interface WardsProps {
  value?: { label: string; value: string };
  onChange: (props: any) => void;
  disabled?: boolean;
}

function Wards({ value, disabled, onChange }: WardsProps) {
  /**
   *
   * @param search
   * @param callback
   */
  const loadOptions = debounce(
    (search: string, callback: (options: any) => void) => {
      http
        .get<never, any>(
          `/ward?${queryString.stringify({ search, page: 1, per_page: 30 })}`
        )
        .then(({ wards }: { wards: WardModel[] }) => {
          callback(wards.map((i) => ({ label: i.name, value: i.id })));
        });
    },
    500
  );

  return (
    <AsyncSelect
      cacheOptions
      defaultOptions
      placeholder=""
      onChange={onChange}
      isDisabled={disabled}
      loadOptions={loadOptions}
      value={value?.value ? value : ''}
      styles={Field.Select.Components.styles}
      components={{ ...Field.Select.Components }}
      noOptionsMessage={({ inputValue }) => {
        if (inputValue) {
          return 'No ward matches your search query';
        } else {
          return 'Start typing to search for a ward';
        }
      }}
    />
  );
}

export default Wards;
