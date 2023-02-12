import { ChangeEvent, HtmlHTMLAttributes, useCallback, useState } from 'react';
import debounce from 'lodash/debounce';

import { SearchIcon } from '@healthcare/icons';
import { Group } from '../Group/Group';
import { Input } from '../Input/Input';
import { helpers } from '@healthcare/utils';

export interface SearchProps extends HtmlHTMLAttributes<HTMLInputElement> {
  onSearch: (search: string) => void;
}

export function Search({ onSearch, className, ...props }: SearchProps) {
  /**
   * state
   */
  const [search, setSearch] = useState<string>();

  /**
   * function
   */
  const handleSearch = useCallback(
    debounce((search) => {
      onSearch(search);
    }, 500),
    []
  );

  return (
    <Group
      name="search"
      withFormik={false}
      wrapperClassName="!mb-0 md:max-w-[328px] w-full"
    >
      <span className="pl-4">
        <SearchIcon className="text-gray-500" />
      </span>
      <Input
        type="search"
        name="search"
        value={search || ''}
        withFormik={false}
        placeholder="Search ..."
        className={helpers.classNames('px-0', className)}
        onChange={({
          currentTarget: { value },
        }: ChangeEvent<HTMLInputElement>) => {
          setSearch(value);
          handleSearch(value);
        }}
      />
    </Group>
  );
}
