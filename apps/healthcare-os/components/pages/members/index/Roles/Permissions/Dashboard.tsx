import { Accordion, Field } from '@healthcareos/react';

export interface DashboardProps {
  values: any;
  setFieldValue: (name: string, value: any, shouldValidate?: boolean) => void;
}

function Dashboard({ values, setFieldValue }: DashboardProps) {
  const items = [
    { label: 'View dashboard', value: 'dashboard' },
    { label: 'View patients summary', value: 'report_patient_summary' },
    { label: 'View diagnoses summary', value: 'report_diagnosis_summary' },
    {
      label: 'View investigation requests summary',
      value: 'report_investigation_request_summary',
    },
    { label: 'View medications summary', value: 'report_medicine_summary' },
    { label: 'View wards summary', value: 'report_ward_summary' },
    { label: 'View financial summary', value: 'report_finance_summary' },
  ];

  return (
    <Accordion.Item
      className="border border-gray-200 p-4 rounded-lg"
      header={<h4>Dashboard</h4>}
    >
      <div className="grid gap-4">
        {items.map((item, key) => {
          const permission = values.find((i) => i.name === item.value);

          return (
            <Field.Toggle
              key={key}
              name={item.value}
              checked={!!permission}
              className="flex items-center gap-2"
              onChange={(checked) => {
                if (checked) {
                  setFieldValue('permissions', [
                    ...values,
                    { name: item.value, access_level: 'all' },
                  ]);
                } else {
                  setFieldValue(
                    'permissions',
                    values.filter((i) => i.name !== item.value)
                  );
                }
              }}
            >
              <span>{item.label}</span>
            </Field.Toggle>
          );
        })}
      </div>
    </Accordion.Item>
  );
}

export default Dashboard;
