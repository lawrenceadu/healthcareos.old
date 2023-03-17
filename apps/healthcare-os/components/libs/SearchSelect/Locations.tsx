import { debounce } from 'lodash';
import { Field } from '@healthcareos/react';
import { http } from '@healthcare/utils';
import AsyncSelect from 'react-select/async';
import queryString from 'query-string';

import { ItemModel } from '../../../models';

export interface LocationsProps {
  value?: { label: string; value: string };
  options?: [{ label: string; value: string }];
  onChange: (props: any) => void;
}

function Locations({ value, options, onChange }: LocationsProps) {
  /**
   *
   * @param search
   * @param callback
   */
  const loadOptions = debounce(
    (search: string, callback: (options: any) => void) => {
      http
        .get<never, any>(`/location?${queryString.stringify({ search })}`)
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
      onChange={onChange}
      loadOptions={loadOptions}
      value={value?.value ? value : ''}
      styles={Field.Select.Components.styles}
      placeholder="Start typing to search for a location"
      components={{ ...Field.Select.Components }}
    />
  );
}

export default Locations;
