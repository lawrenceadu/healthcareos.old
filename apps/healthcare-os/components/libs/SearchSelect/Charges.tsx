import { debounce } from 'lodash';
import { Field } from '@healthcareos/react';
import { http } from '@healthcare/utils';
import AsyncSelect from 'react-select/async';
import queryString from 'query-string';

import { ChargeModel } from '../../../models';

export interface ChargesProps {
  value?: { label: string; value: string };
  options?: [{ label: string; value: string }];
  onChange: (props: any) => void;
}

function Charges({ value, options, onChange }: ChargesProps) {
  /**
   *
   * @param search
   * @param callback
   */
  const loadOptions = debounce(
    (search: string, callback: (options: any) => void) => {
      http
        .get<never, any>(`/charge?${queryString.stringify({ search })}`)
        .then(({ charges }: { charges: ChargeModel[] }) => {
          callback(
            charges.map((i) => ({ label: i.name, value: i.id, charge: i }))
          );
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
      placeholder="Start typing to search for an item"
      components={{ ...Field.Select.Components }}
    />
  );
}

export default Charges;
