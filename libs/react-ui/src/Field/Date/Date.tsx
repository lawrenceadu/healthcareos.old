import { useMemo, useRef } from 'react';
import FlatpickrBase, { DateTimePickerProps } from 'react-flatpickr';
import { CalendarIcon, XMarkIcon } from '@healthcare/icons';
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
  const flp = useRef<FlatpickrBase>(null);
  /**
   * variables
   */
  const memoizedOptions = useMemo(
    () => ({
      ...options,
      disableMobile: true,
      ...(!options?.noCalendar && {
        dateFormat: options?.enableTime ? 'd - M - Y @ h:i K' : 'd - M - Y',
      }),
    }),
    [options]
  );

  const hasValue = (() => {
    if (Array.isArray(value)) {
      return value.length > 0;
    }

    return !!value;
  })();

  return (
    <>
      <Flatpickr
        ref={flp}
        value={
          value
            ? Array.isArray(value)
              ? value.map((i) => dayjs(i).toDate())
              : dayjs(value as string).toDate()
            : undefined
        }
        className={helpers.classNames(
          className,
          'input block outline-none w-full px-4',
          'disabled:bg-gray-100 disabled:text-gray-500'
        )}
        onChange={(date: Date[]) => {
          const value =
            memoizedOptions?.mode === 'range'
              ? date.map((d: Date) => dayjs(d).format('YYYY-MM-DD'))
              : dayjs(date[0]).format(
                  memoizedOptions?.enableTime
                    ? 'YYYY-MM-DDTHH:mm'
                    : 'YYYY-MM-DD'
                );

          if (memoizedOptions?.mode === 'range') {
            if (value.length === 2) {
              setFieldValue(String(name), value);
            }
          } else {
            setFieldValue(String(name), value);
          }

          setTimeout(() => setFieldTouched?.(String(name), true));
        }}
        options={{
          ...memoizedOptions,
          disableMobile: true,
          ...(!memoizedOptions?.noCalendar && {
            dateFormat: memoizedOptions?.enableTime
              ? 'd - M - Y @ h:i K'
              : 'd - M - Y',
          }),
        }}
        placeholder={
          placeholder ||
          (memoizedOptions?.enableTime
            ? '01 - jan - 2023 @ 6:00 PM'
            : '01 -  jan - 2023')
        }
        {...props}
      />
      <span className="px-4 absolute right-0">
        {hasValue ? (
          <span
            role="button"
            className="cursor-pointer"
            onClick={() => {
              setFieldValue(
                String(name),
                memoizedOptions?.mode === 'range' ? [] : ''
              );
              flp?.current?.flatpickr.clear();
            }}
          >
            <XMarkIcon />
          </span>
        ) : (
          <CalendarIcon className="text-neutral-500" />
        )}
      </span>
    </>
  );
}

export default Date;
