import { debounce } from 'lodash';
import { Field } from '@healthcareos/react';
import { http } from '@healthcare/utils';
import AsyncCreatableSelect from 'react-select/async-creatable';
import AsyncSelect from 'react-select/async';
import queryString from 'query-string';

import { MedicineModel } from '../../../models';

export interface MedicinesProps {
  isMulti?: boolean;
  value?: { label: string; value: string };
  onChange: (props: any) => void;
  disabled?: boolean;
  withSystem?: boolean;
}

function Medicines({
  value,
  isMulti,
  disabled,
  onChange,
  withSystem = false,
}: MedicinesProps) {
  /**
   * variables
   */
  const Select = withSystem ? AsyncCreatableSelect : AsyncSelect;

  /**
   *
   * @param search
   * @param callback
   */
  const loadOptions = debounce(
    (search: string, callback: (options: any) => void) => {
      http
        .get<never, any>(
          `/medicine?${queryString.stringify({
            search,
            page: 1,
            per_page: 30,
            system: withSystem,
          })}`
        )
        .then(({ medicines }: { medicines: MedicineModel[] }) => {
          callback(
            medicines.map((i) => ({ label: i.name, value: i.id, medicine: i }))
          );
        });
    },
    500
  );

  return (
    <Select
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
          return 'No medicine matches your search query';
        } else {
          return 'Start typing to search for a medicine';
        }
      }}
    />
  );
}

export default Medicines;
