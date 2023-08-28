import { Dispatch, SetStateAction } from 'react';
import { helpers } from '@healthcare/utils';
import { Field } from '@healthcareos/react';

export interface DateRangeProps {
  title: string;
  dates: string[];
  setDates: Dispatch<SetStateAction<string[]>>;
}

export function DateRange({ title, dates, setDates }: DateRangeProps) {
  return (
    <div
      className={helpers.classNames(
        'mb-6',
        'flex flex-wrap items-center justify-between gap-2'
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

export default DateRange;
