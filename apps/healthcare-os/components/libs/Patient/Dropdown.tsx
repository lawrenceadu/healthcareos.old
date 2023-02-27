import { ChevronDownIcon } from '@healthcare/icons';
import { helpers } from '@healthcare/utils';
import { Dropdown as BaseDropdown } from '@healthcareos/react';

function Dropdown() {
  return (
    <BaseDropdown className="ml-auto">
      <BaseDropdown.Toggle className="flex gap-2 items-center">
        <span className="w-2 h-2 rounded-full bg-red-600" />
        <div
          className={helpers.classNames(
            'bg-gray-500',
            'w-10 h-10 rounded-full',
            'flex flex-[0_0_2.5rem]'
          )}
        >
          <p className="text-lg m-auto text-white font-semibold">JK</p>
        </div>

        <div className="text-left truncate">
          <p className="text-sm font-semibold truncate">Consulting room</p>
          <p className="text-xs text-gray-600 truncate">Vtial room</p>
        </div>

        <span className="ml-3">
          <ChevronDownIcon />
        </span>
      </BaseDropdown.Toggle>
      <BaseDropdown.Menu>
        {[
          { label: 'Critical', value: 'critical', color: '#DC2626' },
          { label: 'Mild', value: 'mild', color: '#d97706' },
          { label: 'None', value: 'none', color: '#16a34a' },
        ].map((i, key) => (
          <BaseDropdown.Item key={key} className="gap-2">
            <span
              className="w-2 h-2 rounded-full bg-red-600"
              style={{ backgroundColor: i.color }}
            />
            <span className="font-medium">{i.label}</span>
          </BaseDropdown.Item>
        ))}
      </BaseDropdown.Menu>
    </BaseDropdown>
  );
}

export default Dropdown;
