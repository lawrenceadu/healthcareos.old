import { debounce } from 'lodash';
import { Field } from '@healthcareos/react';
import { http } from '@healthcare/utils';
import AsyncSelect from 'react-select/async';
import queryString from 'query-string';

import { ItemModel } from '../../../models';

export interface LocationsProps {
  value?: { label: string; value: string };
  onChange: (props: any) => void;
  disabled?: boolean;
}

function Locations({ value, disabled, onChange }: LocationsProps) {
  /**
   *
   * @param search
   * @param callback
   */
  const loadOptions = debounce(
    (search: string, callback: (options: any) => void) => {
      http
        .get<never, any>(
          `/location?${queryString.stringify({
            search,
            page: 1,
            per_page: 30,
          })}`
        )
        .then(({ locations }: { locations: ItemModel[] }) => {
          callback(
            locations.map((i) => ({ label: i.name, value: i.id, item: i }))
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
      isDisabled={disabled}
      loadOptions={loadOptions}
      value={value?.value ? value : ''}
      styles={Field.Select.Components.styles}
      components={{ ...Field.Select.Components }}
      noOptionsMessage={({ inputValue }) => {
        if (inputValue) {
          return 'No location matches your search query';
        } else {
          return 'Start typing to search for a location';
        }
      }}
    />
  );
}

export default Locations;
