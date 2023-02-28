import { useContext } from 'react';
import { Dropdown as BaseDropdown } from '@healthcareos/react';
import { ChevronDownIcon } from '@healthcare/icons';
import { helpers } from '@healthcare/utils';

import { PatientContext } from '../../../contexts/Patient';

function Dropdown() {
  /**
   * context
   */
  const { patient, setPatient } = useContext(PatientContext);

  return (
    <BaseDropdown className="ml-auto">
      <BaseDropdown.Toggle className="flex gap-2 items-center">
        {patient.severity && (
          <span
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: patient.severity.color }}
          />
        )}
        <div
          className={helpers.classNames(
            'bg-gray-500',
            'w-10 h-10 rounded-full',
            'flex flex-[0_0_2.5rem]'
          )}
        >
          <p className="text-lg m-auto text-white font-semibold">
            {[patient.first_name?.[0], patient.last_name?.[0]].join('')}
          </p>
        </div>

        {patient.queue && (
          <div className="text-left truncate mr-3">
            <p className="text-sm font-semibold truncate">
              {patient.queue.location}
            </p>
            <p className="text-xs text-gray-600 truncate">Position in queue</p>
          </div>
        )}

        <span>
          <ChevronDownIcon />
        </span>
      </BaseDropdown.Toggle>
      <BaseDropdown.Menu>
        {[
          { label: 'Critical', value: 'critical', color: '#DC2626' },
          { label: 'Mild', value: 'mild', color: '#d97706' },
          { label: 'None', value: 'none', color: '#16a34a' },
        ].map((i, key) => (
          <BaseDropdown.Item
            key={key}
            className="gap-2"
            active={i.label === patient.severity?.name}
            onClick={() =>
              setPatient({
                ...patient,
                severity: { name: i.label, color: i.color },
              })
            }
          >
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
