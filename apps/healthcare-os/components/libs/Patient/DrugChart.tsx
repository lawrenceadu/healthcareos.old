import { useState } from 'react';
import { Accordion, Badge, Field } from '@healthcareos/react';
import { helpers } from '@healthcare/utils';
import dayjs from 'dayjs';

function DrugChart() {
  /**
   * variables
   */
  const format = 'YYYY/MM/DD';

  /**
   * state
   */
  const [dates, setDates] = useState([
    dayjs().startOf('week').format(format),
    dayjs().endOf('week').format(format),
  ]);

  return (
    <div>
      <div className="flex justify-end mb-6">
        <Field.Group
          name="date"
          withFormik={false}
          wrapperClassName="max-w-[320px] w-full"
        >
          <Field.Date
            value={dates}
            options={{ mode: 'range' }}
            setFieldValue={(name, value) => setDates(value as string[])}
          />
        </Field.Group>
      </div>

      <Accordion className="flex flex-col gap-4">
        <Accordion.Item
          className="rounded-lg p-4 border border-gray-200"
          header={<p className="text-lg font-bold">26 Feb. 2023</p>}
        >
          {[1, 2, 3].map((i, key) => (
            <div
              key={key}
              className={helpers.classNames(
                key !== 3 - 1 && 'mb-2 pb-2 border-b border-neutral-200'
              )}
            >
              <div className="flex gap-2 justify-between items-end font-medium">
                <div>
                  <p className="text-xs text-gray-600">04:30 pm</p>
                  <p className="text-sm font-bold">
                    Multivitamin oral suspension
                  </p>
                </div>
                <span>
                  <Badge variant="danger">stat</Badge>
                </span>
              </div>
            </div>
          ))}
        </Accordion.Item>
      </Accordion>
    </div>
  );
}

export default DrugChart;
