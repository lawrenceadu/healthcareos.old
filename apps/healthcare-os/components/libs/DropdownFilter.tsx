import { Button, Dropdown } from '@healthcareos/react';
import { CheckIcon, ChevronDownIcon } from '@healthcare/icons';

export interface DropdownFilterProps {
  name: string;
  value: unknown;
  options: { label: string; value: unknown }[];
  setValue: (value: unknown) => void;
}

function DropdownFilter({
  name,
  value,
  options,
  setValue,
}: DropdownFilterProps) {
  /**
   * variable
   */
  const selectedOption = options.find((i) => i.value === value);

  return (
    <Dropdown>
      <Dropdown.Toggle
        as={Button}
        type="button"
        className="btn-input w-full md:w-auto"
        contentClassName="!justify-between w-full"
      >
        <span>{selectedOption ? selectedOption.label : name}</span>
        <ChevronDownIcon />
      </Dropdown.Toggle>
      <Dropdown.Menu>
        {[{ label: name, value: undefined }, ...options].map((option, key) => (
          <Dropdown.Item
            key={key}
            active={option.value === selectedOption?.value}
            onClick={() => setValue(option.value)}
          >
            <span>{option.label}</span>
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default DropdownFilter;
