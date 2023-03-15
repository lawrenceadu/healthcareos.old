export const classNames = (...classes: any) => {
  return classes.filter(Boolean).join(' ');
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
  ];
})();
