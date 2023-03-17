import dayjs from 'dayjs';

export const classNames = (...classes: any) => {
  return classes.filter(Boolean).join(' ');
};

export const generateTimeRange = (
  startTime = '00:00',
  endTime = '23:59'
): { label: string; value: string }[] => {
  const start = new Date(`2023-01-01T${startTime}`);
  const end = new Date(`2023-01-01T${endTime}`);
  const timeRange = [];

  for (let time = start; time <= end; time.setMinutes(time.getMinutes() + 5)) {
    const formattedTime = time.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
    const times = formattedTime.split(':');

    timeRange.push({
      label: dayjs()
        .set('hour', Number(times[0]))
        .set('minutes', Number(times[1]))
        .format('h:mm a'),
      value: formattedTime,
    });
  }

  return timeRange;
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
  ].map((i) => ({ label: i, value: i.toLowerCase() })))();
