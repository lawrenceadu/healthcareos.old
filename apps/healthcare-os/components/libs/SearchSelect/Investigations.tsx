import { debounce } from 'lodash';
import { Field } from '@healthcareos/react';
import { http } from '@healthcare/utils';
import AsyncSelect from 'react-select/async';
import queryString from 'query-string';

import { InvestigationModel } from '../../../models';

export interface InvestigationsProps {
  isMulti?: boolean;
  value?: { label: string; value: string };
  onChange: (props: any) => void;
  disabled?: boolean;
}

function Investigations({
  value,
  isMulti,
  disabled,
  onChange,
}: InvestigationsProps) {
  /**
   *
   * @param search
   * @param callback
   */
  const loadOptions = debounce(
    (search: string, callback: (options: any) => void) => {
      http
        .get<never, any>(
          `/investigation?${queryString.stringify({
            search,
            page: 1,
            per_page: 30,
          })}`
        )
        .then(
          ({ investigations }: { investigations: InvestigationModel[] }) => {
            callback(
              investigations.map((i) => ({ label: i.name, value: i.id }))
            );
          }
        );
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
          return 'No investigation matches your search query';
        } else {
          return 'Start typing to search for an investigation';
        }
      }}
    />
  );
}

export default Investigations;
