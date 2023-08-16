import { debounce } from 'lodash';
import { Field } from '@healthcareos/react';
import { http } from '@healthcare/utils';
import AsyncSelect from 'react-select/async';
import queryString from 'query-string';

import { ItemModel } from '../../../models';

export interface ItemsProps {
  isMulti?: boolean;
  value?: { label: string; value: string };
  onChange: (props: any) => void;
  disabled?: boolean;
}

function Items({ value, isMulti, disabled, onChange }: ItemsProps) {
  /**
   *
   * @param search
   * @param callback
   */
  const loadOptions = debounce(
    (search: string, callback: (options: any) => void) => {
      http
        .get<never, any>(
          `/item?${queryString.stringify({ search, page: 1, per_page: 30 })}`
        )
        .then(({ items }: { items: ItemModel[] }) => {
          callback(items.map((i) => ({ label: i.name, value: i.id, item: i })));
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
          return 'No item matches your search query';
        } else {
          return 'Start typing to search for an item';
        }
      }}
    />
  );
}

export default Items;
