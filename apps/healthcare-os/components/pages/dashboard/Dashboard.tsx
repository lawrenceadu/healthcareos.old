import { Dispatch, SetStateAction, useState } from 'react';
import { helpers } from '@healthcare/utils';
import { Field, Tabs } from '@healthcareos/react';
import queryString from 'query-string';
import useSWR from 'swr';
import dayjs from 'dayjs';

import { usePermissions } from '../../../hooks';
import Onboarding from './Dashboard/Onboarding';
import TopTens from './Dashboard/TopTens';
import PD from './Dashboard/PD';

function Dashboard() {
  /**
   * perm
   */
  const [
    patientSummary,
    diagnosesSummary,
    investigationSummary,
    medicationSummary,
    wardSummary,
  ] = usePermissions(
    'report_patient_summary',
    'report_diagnosis_summary',
    'report_investigation_request_summary',
    'report_medicine_summary',
    'report_ward_summary'
  );

  /**
   * variables
   */
  const format = 'YYYY-MM-DD';
  const tabs = [
    ...(diagnosesSummary
      ? [{ name: 'Diagnoses', slug: 'diagnosis', component: TopTens }]
      : []),
    ...(investigationSummary
      ? [
          {
            name: 'Investigations',
            slug: 'investigation',
            component: TopTens,
          },
        ]
      : []),
    ...(medicationSummary
      ? [{ name: 'Medications', slug: 'medicine', component: TopTens }]
      : []),
    ...(wardSummary
      ? [{ name: 'Wards', slug: 'ward', component: TopTens }]
      : []),
  ];

  /**
   * state
   */
  const [topActiveKey, setTopActiveKey] = useState('diagnosis');
  const [summaryDates, setSummaryDates] = useState<string[]>([
    dayjs().startOf('month').format(format),
    dayjs().endOf('month').format(format),
  ]);
  const [topDates, setTopDates] = useState<string[]>([
    dayjs().startOf('month').format(format),
    dayjs().endOf('month').format(format),
  ]);

  /**
   * api
   */
  const { data: summaryData } = useSWR<{
    summary: { [x: string]: { label: string; value: number; color: string }[] };
  }>(
    `/report/patient/summary?${queryString.stringify({
      start_date: summaryDates[0],
      end_date: summaryDates[1],
    })}`
  );

  return (
    <div>
      {patientSummary && (
        <div className="mb-10">
          <DateRange
            title="Summary"
            dates={summaryDates}
            setDates={setSummaryDates}
          />

          <div className="mb-10">
            <p className="text-lg font-bold mb-4">Patients onboarded</p>
            <div className={helpers.classNames('grid gap-6 lg:grid-cols-2')}>
              <Onboarding data={summaryData?.summary} />
            </div>
          </div>

          <div className="mb-10">
            <p className="text-lg font-bold mb-4">Inpatient and Outpatient</p>
            <div className={helpers.classNames('grid gap-6 lg:grid-cols-2')}>
              <PD data={summaryData?.summary} />
            </div>
          </div>
        </div>
      )}
      {(diagnosesSummary ||
        investigationSummary ||
        medicationSummary ||
        wardSummary) && (
        <div className="mb-14">
          <DateRange title="Top 10s" dates={topDates} setDates={setTopDates} />
          <Tabs
            tabs={tabs}
            activeKey={topActiveKey}
            childProps={{ dates: topDates, slug: topActiveKey }}
            onSelect={(key) => setTopActiveKey(key)}
          />
        </div>
      )}
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

export default Dashboard;
