import { useState } from 'react';
import { FilterIcon } from '@healthcare/icons';

import Dropdown from '../../Dropdown/Dropdown';
import Search from '../../Field/Search/Search';
import Button from '../../Button/Button';

export interface FilterDropdownProps {
  label: string;
  value?: string;
  withSearch?: boolean;
  onClick?: (key: any) => void;
  options: { label: string; value: any }[];
}

export function FilterDropdown({
  label,
  value,
  options,
  onClick,
  withSearch,
}: FilterDropdownProps) {
  /**
   * variables
   */
  const selected = options.find((option) => option.value === value);

  /**
   * state
   */
  const [search, setSearch] = useState('');

  return (
    <Dropdown>
      <Dropdown.Toggle as={Button} className="btn-input">
        <span className="mr-2">{selected ? selected.label : label}</span>
        <FilterIcon className="w-5 h-5" />
      </Dropdown.Toggle>
      <Dropdown.Menu className="position-fixed pt-0">
        {withSearch && (
          <Search
            delay={0}
            onSearch={(key: string) => setSearch(key)}
          />
        )}
        {options
          .filter(({ label }) =>
            label.toLowerCase().includes(search.toLowerCase())
          )
          .map(({ label, value, ...rest }, key) => (
            <Dropdown.Item
              key={key}
              active={selected?.value === value}
              onClick={() => onClick && onClick({ label, value, ...rest })}
            >
              {label}
            </Dropdown.Item>
          ))}
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default FilterDropdown;
