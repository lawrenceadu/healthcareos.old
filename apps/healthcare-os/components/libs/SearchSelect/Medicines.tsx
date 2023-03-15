import { debounce } from 'lodash';
import { Field } from '@healthcareos/react';
import { http } from '@healthcare/utils';
import AsyncSelect from 'react-select/async';
import queryString from 'query-string';

import { MedicineModel } from '../../../models';

export interface MedicinesProps {
  value?: { label: string; value: string };
  options?: [{ label: string; value: string }];
  onChange: (props: any) => void;
}

function Medicines({ value, options, onChange }: MedicinesProps) {
  /**
   *
   * @param search
   * @param callback
   */
  const loadOptions = debounce(
    (search: string, callback: (options: any) => void) => {
      http
        .get<never, any>(`/medicine?${queryString.stringify({ search })}`)
        .then(({ medicines }: { medicines: MedicineModel[] }) => {
          callback(
            medicines.map((i) => ({ label: i.name, value: i.id, medicines }))
          );
        });
    },
    500
  );

  return (
    <AsyncSelect
      cacheOptions
      value={value}
      loadOptions={loadOptions}
      styles={Field.Select.Components.styles}
      placeholder="Start typing to search for a medicine"
      components={{ ...Field.Select.Components }}
      onChange={onChange}
    />
  );
}

export default Medicines;
