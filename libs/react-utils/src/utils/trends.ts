import dayjs from 'dayjs';

export const trends = (
  dates: string[],
  data: { label: string; income: number; expense: number }[]
) => {
  /**
   * variables
   */
  const daysDiff = dayjs(dates[1]).diff(dates[0], 'days');

  // across multiple months
  if (daysDiff > 31) {
    return data.map(({ label, ...data }) => ({ name: label, ...data }));
  } else {
    return data.map(({ label, ...data }) => ({
      name: dayjs(label).format('MMM, ddd DD'),
      ...data,
    }));
  }
};
