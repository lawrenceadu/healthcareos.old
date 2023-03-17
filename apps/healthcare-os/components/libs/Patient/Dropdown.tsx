import { Dropdown as BaseDropdown } from '@healthcareos/react';
import { ChevronDownIcon } from '@healthcare/icons';
import { helpers } from '@healthcare/utils';
import useSWR from 'swr/immutable';

import { setPatientTriageService } from '../../../services/patient';
import { TriageModel } from '../../../models';
import { usePatient } from '../../../hooks';
import { toast } from 'react-toastify';

function Dropdown() {
  /**
   * context
   */
  const { patient, mutate, updateHistory } = usePatient();

  /**
   * api
   */
  const { data } = useSWR<{ triages: TriageModel[] }>(`/triage`);

  /**
   * variables
   */
  const triages = data?.triages || [];

  return (
    <>
      {patient && (
        <BaseDropdown className="ml-auto">
          <BaseDropdown.Toggle className="flex gap-2 items-center">
            {patient.triage && (
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: patient.triage.colour }}
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
                  {patient.queue.name}
                </p>
                <p className="text-xs text-gray-600 truncate">
                  Position in queue
                </p>
              </div>
            )}

            <span>
              <ChevronDownIcon />
            </span>
          </BaseDropdown.Toggle>
          <BaseDropdown.Menu>
            {triages.map((i, key) => (
              <BaseDropdown.Item
                key={key}
                className="gap-2"
                active={i.id === patient.triage?.id}
                onClick={() => {
                  setPatientTriageService({
                    patient: patient.id,
                    triage: i.id,
                  })
                    .then(() => {
                      updateHistory();
                      mutate?.();
                    })
                    .catch(() => toast.error('Unable to set patient triage'));
                }}
              >
                <span
                  className="w-2 h-2 rounded-full bg-red-600"
                  style={{ backgroundColor: i.colour }}
                />
                <span className="font-medium">{i.name}</span>
              </BaseDropdown.Item>
            ))}
          </BaseDropdown.Menu>
        </BaseDropdown>
      )}
    </>
  );
}

export default Dropdown;
