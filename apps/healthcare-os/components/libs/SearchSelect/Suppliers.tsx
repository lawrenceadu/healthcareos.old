import { debounce } from 'lodash';
import { Field } from '@healthcareos/react';
import { http } from '@healthcare/utils';
import AsyncSelect from 'react-select/async';
import queryString from 'query-string';

import { ItemModel, SupplierModel } from '../../../models';

export interface SuppliersProps {
  value?: { label: string; value: string };
  options?: [{ label: string; value: string }];
  onChange: (props: any) => void;
}

function Suppliers({ value, options, onChange }: SuppliersProps) {
  /**
   *
   * @param search
   * @param callback
   */
  const loadOptions = debounce(
    (search: string, callback: (options: any) => void) => {
      http
        .get<never, any>(`/supplier?${queryString.stringify({ search })}`)
        .then(({ suppliers }: { suppliers: SupplierModel[] }) => {
          callback(suppliers.map((i) => ({ label: i.name, value: i.id })));
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
      placeholder="Start typing to search for a supplier"
      components={{ ...Field.Select.Components }}
    />
  );
}

export default Suppliers;
