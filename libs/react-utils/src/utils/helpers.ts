import dayjs from 'dayjs';

export const classNames = (...classes: any) => {
  return classes.filter(Boolean).join(' ');
};

export const generateTimeRange = (
  startTime = '00:00',
  endTime = '23:59'
): { label: string; value: string }[] => {
  const start = dayjs(`2023-01-01T${startTime}`);
  const end = dayjs(`2023-01-01T${endTime}`);
  const timeRange = [];

  for (let time = start; time <= end; time = time.add(5, 'minute')) {
    const formattedTime = time.format('HH:mm');
    const [hour, minute] = formattedTime.split(':');

    timeRange.push({
      label: dayjs()
        .set('hour', Number(hour))
        .set('minute', Number(minute))
        .format('h:mm a'),
      value: formattedTime,
    });
  }

  return timeRange;
};

export const formatNumber = (num: number, precise?: boolean) => {
  const suffixes = ['', 'k', 'mil', 'bil', 'tri', 'qua'];
  let suffixIndex = 0;

  // divide the number by 1000 until it is less than 1000
  while (num >= 1000) {
    num /= 1000;
    suffixIndex++;
  }

  // round the number to 1 decimal place and add the suffix
  return (precise ? num.toFixed(1) : Math.floor(num)) + suffixes[suffixIndex];
};

export const medicineUnits = (() => {
  return [
    { label: 'Gram (g)', value: 'g' },
    { label: 'Milligram (mg)', value: 'mg' },
    { label: 'Microgram (mcg)', value: 'mcg' },
    { label: 'Kilogram (kg)', value: 'kg' },
    { label: 'Liter (L)', value: 'L' },
    { label: 'Milliliter (mL)', value: 'mL' },
    { label: 'Teaspoon (tsp)', value: 'tsp' },
    { label: 'Tablespoon (tbsp)', value: 'tbsp' },
    { label: 'Drop (gtt)', value: 'gtt' },
    { label: 'Puff', value: 'puff' },
    { label: 'Tablet', value: 'tablet' },
    { label: 'Capsule', value: 'capsule' },
    { label: 'Application', value: 'application' },
  ];
})();

export const medicineRoutes = (() =>
  [
    'Oral',
    'Buccal',
    'Ear',
    'Eye',
    'Inhalation',
    'Intramuscular',
    'Nasal',
    'Nasogastric',
    'Rectal',
    'Subcutaneous',
    'Sublingual',
    'Topical',
    'Vaginal',
    'Intravenous',
  ].map((i) => ({ label: i, value: i.toLowerCase() })))();
