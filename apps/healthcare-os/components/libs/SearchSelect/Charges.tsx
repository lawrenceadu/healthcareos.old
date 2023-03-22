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
        .get<never, any>(
          `/charge?${queryString.stringify({ search, page: 1, per_page: 30 })}`
        )
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
      defaultOptions
      placeholder=""
      onChange={onChange}
      loadOptions={loadOptions}
      value={value?.value ? value : ''}
      styles={Field.Select.Components.styles}
      components={{ ...Field.Select.Components }}
      noOptionsMessage={({ inputValue }) => {
        if (inputValue) {
          return 'No charge matches your search query';
        } else {
          return 'Start typing to search for a charge';
        }
      }}
    />
  );
}

export default Charges;
