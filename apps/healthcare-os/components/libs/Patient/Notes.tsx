// import { useState } from 'react';
import { Accordion, Button } from '@healthcareos/react';
import { PlusIcon } from '@healthcare/icons';
import { helpers } from '@healthcare/utils';
import useSWR from 'swr';

import { usePatient } from '../../../hooks';
import { NoteModel } from '../../../models';
import AddForm from './Notes/Add';
import Float from '../Float';
import dayjs from 'dayjs';

export function Notes() {
  /**
   * hooks
   */
  const { patient } = usePatient();

  /**
   * state
   */
  // const [filters, setFilters] = useState<
  //   Partial<{ search: string; filter: string }>
  // >({});

  /**
   * api
   */
  const { data, mutate } = useSWR<{ notes: NoteModel[] }>(
    `/note?patient=${patient.id}`
  );

  /**
   * variables
   */
  const items =
    data?.notes?.map((note) => ({
      reference: note.reference,
      items: [
        { label: 'Added by', value: note.created_by.name },
        {
          label: 'Added on',
          value: dayjs(note.created_at).format('DD MMM, YYYY @ h:mm a'),
        },
        {
          label: 'Notes',
          value: note.notes,
        },
      ],
    })) || [];

  return (
    <>
      {/* <div className="flex gap-4 items-center mb-6">
        <Field.Search
          onSearch={(key) => setFilters({ ...filters, search: key })}
        />
        <Filter.Dropdown
          label="Filters"
          value={filters?.filter}
          options={[
            { label: 'Doctor', value: 'doctor' },
            { label: 'Nurse', value: 'nurse' },
            { label: 'All notes', value: 'all' },
          ]}
          onClick={({ value }: { value: string }) =>
            setFilters({ ...filters, filter: value })
          }
        />
      </div> */}

      <Accordion className="flex flex-col gap-4">
        {items.map((item, key) => (
          <Accordion.Item
            key={key}
            defaultOpen={!key}
            className="rounded-lg p-4 border border-gray-200"
            header={<p className="text-lg font-bold">{item.reference}</p>}
          >
            <div className="grid gap-2 font-medium">
              {/* <p className="text-xs text-green-700">Doctor</p> */}
              {item.items.map((i, key) => (
                <div key={key}>
                  <small className="text-gray-600 block">{i.label}</small>
                  <small>{i.value}</small>
                </div>
              ))}
            </div>
          </Accordion.Item>
        ))}
      </Accordion>

      <Float>
        <AddForm {...{ mutate }}>
          {({ proceed }) => (
            <Button
              onClick={() => proceed()}
              className={helpers.classNames('btn-primary')}
            >
              <PlusIcon />
              <span>Add notes</span>
            </Button>
          )}
        </AddForm>
      </Float>
    </>
  );
}

export default Notes;
