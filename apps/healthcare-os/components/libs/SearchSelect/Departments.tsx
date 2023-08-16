import { debounce } from 'lodash';
import { Field } from '@healthcareos/react';
import { http } from '@healthcare/utils';
import AsyncSelect from 'react-select/async';
import queryString from 'query-string';

import { DepartmentModel } from '../../../models';

export interface DepartmentsProps {
  isMulti?: boolean;
  value?: { label: string; value: string };
  onChange: (props: any) => void;
  disabled?: boolean;
}

function Departments({ value, isMulti, disabled, onChange }: DepartmentsProps) {
  /**
   *
   * @param search
   * @param callback
   */
  const loadOptions = debounce(
    (search: string, callback: (options: any) => void) => {
      http
        .get<never, any>(`/department?${queryString.stringify({ search })}`)
        .then(({ departments }: { departments: DepartmentModel[] }) => {
          callback(departments.map((i) => ({ label: i.name, value: i.id })));
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
          return 'No department matches your search query';
        } else {
          return 'Start typing to search for a department';
        }
      }}
    />
  );
}

export default Departments;
