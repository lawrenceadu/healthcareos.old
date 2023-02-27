import { ChevronDownIcon } from '@healthcare/icons';
import { Dropdown } from '@healthcareos/react';

export function Select({
  value,
  options,
  onSelect,
}: {
  value: unknown;
  onSelect: (value: unknown) => void;
  options: { label: string; value: unknown }[];
}) {
  const selected = options.find((o) => o.value === value);

  return (
    <Dropdown>
      <Dropdown.Toggle type="button" className="px-2 gap-2">
        <span>{selected?.label}</span>
        <ChevronDownIcon size={20} />
      </Dropdown.Toggle>
      <Dropdown.Menu>
        {options.map((i, key) => (
          <Dropdown.Item
            key={key}
            active={selected?.value === i.value}
            onClick={() => onSelect(i.value)}
          >
            {i.label}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default Select;
