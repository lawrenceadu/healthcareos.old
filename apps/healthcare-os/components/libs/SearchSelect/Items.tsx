import { debounce } from 'lodash';
import { Field } from '@healthcareos/react';
import { http } from '@healthcare/utils';
import AsyncSelect from 'react-select/async';
import queryString from 'query-string';

import { ItemModel } from '../../../models';

export interface ItemsProps {
  value?: { label: string; value: string };
  options?: [{ label: string; value: string }];
  onChange: (props: any) => void;
}

function Items({ value, options, onChange }: ItemsProps) {
  /**
   *
   * @param search
   * @param callback
   */
  const loadOptions = debounce(
    (search: string, callback: (options: any) => void) => {
      http
        .get<never, any>(`/item?${queryString.stringify({ search })}`)
        .then(({ items }: { items: ItemModel[] }) => {
          callback(items.map((i) => ({ label: i.name, value: i.id, item: i })));
        });
    },
    500
  );

  return (
    <AsyncSelect
      cacheOptions
      loadOptions={loadOptions}
      value={value?.value ? value : ''}
      styles={Field.Select.Components.styles}
      placeholder="Start typing to search for an item"
      components={{ ...Field.Select.Components }}
      onChange={onChange}
    />
  );
}

export default Items;
