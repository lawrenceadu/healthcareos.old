import { debounce } from 'lodash';
import { Field } from '@healthcareos/react';
import { http } from '@healthcare/utils';
import AsyncSelect from 'react-select/async';
import queryString from 'query-string';

import { WardModel } from '../../../models';

export interface WardsProps {
  value?: { label: string; value: string };
  options?: [{ label: string; value: string }];
  onChange: (props: any) => void;
}

function Wards({ value, options, onChange }: WardsProps) {
  /**
   *
   * @param search
   * @param callback
   */
  const loadOptions = debounce(
    (search: string, callback: (options: any) => void) => {
      http
        .get<never, any>(`/ward?${queryString.stringify({ search })}`)
        .then(({ wards }: { wards: WardModel[] }) => {
          callback(wards.map((i) => ({ label: i.name, value: i.id })));
        });
    },
    500
  );

  return (
    <AsyncSelect
      cacheOptions
      onChange={onChange}
      loadOptions={loadOptions}
      value={value?.value ? value : ''}
      styles={Field.Select.Components.styles}
      placeholder="Start typing to search for a ward"
      components={{ ...Field.Select.Components }}
    />
  );
}

export default Wards;
