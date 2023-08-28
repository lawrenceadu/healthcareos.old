import { useState } from 'react';
import { helpers } from '@healthcare/utils';
import { Field } from '@healthcareos/react';
import dayjs from 'dayjs';
import monthSelectPlugin from 'flatpickr/dist/plugins/monthSelect';

import OPD from './DHIMS/OPD';

function DHIMS() {
  /**
   * variables
   */
  const format = 'YYYY-MM-DD';

  /**
   * state
   */
  const [date, setDate] = useState<string>(
    dayjs().startOf('month').format(format)
  );

  return (
    <div>
      <div
        className={helpers.classNames(
          'mb-6',
          'flex flex-wrap items-center justify-between gap-2'
        )}
      >
        <p className="text-lg font-bold">DHIMS</p>
        <Field.Group
          name="range"
          withFormik={false}
          wrapperClassName="w-full max-w-[320px]"
        >
          <Field.Date
            value={date}
            options={{
              plugins: [monthSelectPlugin({ shorthand: false })],
            }}
            setFieldValue={(name, date) => setDate(date as string)}
          />
        </Field.Group>
      </div>

      <div className="mb-10">
        <p className="text-lg font-bold mb-4">Statement of OPD</p>
        <OPD date={date} />
      </div>
    </div>
  );
}

export default DHIMS;
