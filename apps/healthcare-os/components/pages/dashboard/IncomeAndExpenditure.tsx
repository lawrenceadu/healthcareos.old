import { Dispatch, SetStateAction, useState } from 'react';
import { ArrowDownIcon, ArrowUpIcon } from '@healthcare/icons';
import { helpers } from '@healthcare/utils';
import { Field } from '@healthcareos/react';
import dayjs from 'dayjs';

import Trends from './IncomeAndExpenditure/Trends';

function IncomeAndExpenditure() {
  /**
   * variables
   */
  const format = 'YYYY-MM-DD';

  /**
   * state
   */
  const [dates, setDates] = useState<string[]>([
    dayjs().startOf('month').format(format),
    dayjs().endOf('month').format(format),
  ]);

  const cards = [
    {
      label: 'Total income',
      slug: 'income',
      value: 'Ghs 123,454.01',
      color: '#22C55E',
      icon: ArrowUpIcon,
    },
    {
      label: 'Total expense',
      slug: 'expense',
      value: 'Ghs 33',
      color: '#DC2626',
      icon: ArrowDownIcon,
    },
  ];

  return (
    <div>
      <div className="mb-10">
        <DateRange
          title="Income and expenditure report"
          {...{ dates, setDates }}
        />

        <div className="grid md:grid-cols-2 gap-6">
          {cards.map((card, key) => (
            <div
              key={key}
              className={helpers.classNames(
                'flex items-end justify-between',
                'rounded-lg border border-neutral-200 p-6'
              )}
            >
              <div>
                <small className="block mb-4 font-medium">{card.label}</small>
                <p className="text-lg font-bold">{card.value}</p>
              </div>
              <div>
                <span
                  className={helpers.classNames(
                    card.slug === 'income' && 'bg-[#22C55E]/10',
                    card.slug === 'expense' && 'bg-[#DC2626]/10',
                    'w-6 h-6 rounded-[4px] flex'
                  )}
                >
                  <card.icon color={card.color} size={16} className="m-auto" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-10">
        <p className="text-lg font-bold mb-6">
          Trends of income vs expenditure
        </p>
        <Trends />
      </div>
    </div>
  );
}

function DateRange({
  title,
  dates,
  setDates,
}: {
  title: string;
  dates: string[];
  setDates: Dispatch<SetStateAction<string[]>>;
}) {
  return (
    <div
      className={helpers.classNames(
        'mb-6',
        'flex flex-wrap justify-between gap-2'
      )}
    >
      <p className="text-lg font-bold">{title}</p>
      <Field.Group
        name="range"
        withFormik={false}
        wrapperClassName="w-full max-w-[320px]"
      >
        <Field.Date
          value={dates}
          options={{ mode: 'range' }}
          setFieldValue={(name, dates) => setDates(dates as string[])}
        />
      </Field.Group>
    </div>
  );
}

export default IncomeAndExpenditure;
