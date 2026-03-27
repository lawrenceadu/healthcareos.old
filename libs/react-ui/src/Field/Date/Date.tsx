import FlatpickrBase, { DateTimePickerProps } from 'react-flatpickr';
import { CalendarIcon } from '@healthcare/icons';
import { helpers } from '@healthcare/utils';
import dayjs from 'dayjs';

const Flatpickr = FlatpickrBase as any;

// eslint-disable-next-line
export interface DateProps extends DateTimePickerProps {
  setFieldValue: (
    field: string,
    value: string | string[],
    shouldValidate?: boolean
  ) => void;
  setFieldTouched?: (
    field: string,
    isTouched?: boolean,
    shouldValidate?: boolean
  ) => void;
}

export function Date({
  name,
  value,
  options,
  className,
  placeholder,
  setFieldValue,
  setFieldTouched,
  ...props
}: DateProps) {
  /**
   * variables
   */
  const _options = { noCalendar: false, ...options };

  return (
    <>
      <Flatpickr
        value={
          value
            ? Array.isArray(value)
              ? value.map((i) => dayjs(i).toDate())
              : dayjs(value as string).toDate()
            : ''
        }
        className={helpers.classNames(
          className,
          'input block outline-none w-full px-4',
          'disabled:bg-gray-100 disabled:text-gray-500'
        )}
        onChange={(date: Date[]) => {
          const value =
            _options?.mode === 'range'
              ? date.map((d: Date) => dayjs(d).format('YYYY-MM-DD'))
              : dayjs(date[0]).format(
                  _options?.enableTime ? 'YYYY-MM-DDTHH:mm' : 'YYYY-MM-DD'
                );

          if (_options?.mode === 'range') {
            if (value.length === 2) {
              setFieldValue(String(name), value);
            }
          } else {
            setFieldValue(String(name), value);
          }

          setTimeout(() => setFieldTouched?.(String(name), true));
        }}
        options={{
          ..._options,
          disableMobile: true,
          ...(!_options?.noCalendar && {
            dateFormat: _options?.enableTime
              ? 'd - M - Y @ h:i K'
              : 'd - M - Y',
          }),
        }}
        placeholder={
          placeholder ||
          (_options?.enableTime
            ? '01 - jan - 2023 @ 6:00 PM'
            : '01 -  jan - 2023')
        }
        {...props}
      />
      <span className="px-4 pointer-events-none absolute right-0">
        <CalendarIcon className="text-neutral-500" />
      </span>
    </>
  );
}

export default Date;
