import { Dispatch, SetStateAction, useState } from 'react';
import { ArrowDownIcon, ArrowUpIcon } from '@healthcare/icons';
import { Field, Tabs } from '@healthcareos/react';
import { helpers } from '@healthcare/utils';
import queryString from 'query-string';
import useSWR from 'swr';
import dayjs from 'dayjs';

import Breakdown from './IncomeAndExpenditure/Breakdown';
import Trends from './IncomeAndExpenditure/Trends';

function IncomeAndExpenditure() {
  /**
   * variables
   */
  const format = 'YYYY-MM-DD';
  const tabs = [
    { name: 'Income', slug: 'income', component: Breakdown },
    { name: 'Expense', slug: 'expense', component: Breakdown },
  ];

  /**
   * state
   */
  const [activeKey, setActiveKey] = useState('income');
  const [dates, setDates] = useState<string[]>([
    dayjs().startOf('month').format(format),
    dayjs().endOf('month').format(format),
  ]);

  /**
   * api
   */
  const { data } = useSWR<{
    summary: {
      income: number;
      expense: number;
      trends: { label: string; income: number; expense: number }[];
    };
  }>(
    `/report/finance/summary?${queryString.stringify({
      start_date: dates[0],
      end_date: dates[1],
    })}`
  );

  const cards = [
    {
      label: 'Total income',
      slug: 'income',
      value: `Ghs ${data?.summary?.income || 0}`,
      color: '#22C55E',
      icon: ArrowUpIcon,
    },
    {
      label: 'Total expense',
      slug: 'expense',
      value: `Ghs ${data?.summary?.expense || 0}`,
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
        <Trends dates={dates} data={data?.summary?.trends} />
      </div>

      <div className="mb-14">
        <p className="text-lg mb-4 font-bold">Report breakdown</p>
        <Tabs
          tabs={tabs}
          activeKey={activeKey}
          childProps={{ slug: activeKey, dates }}
          onSelect={(key) => setActiveKey(key)}
        />
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
