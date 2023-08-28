import queryString from 'query-string';
import useSWR from 'swr';

import Skeleton from '../../../libs/Skeleton';

export interface OPDProps {
  date: string;
}

type DataType = {
  insured: {
    new: { male: number; female: number };
    old: { male: number; female: number };
  };
  uninsured: {
    new: { male: number; female: number };
    old: { male: number; female: number };
  };
};

function OPD({ date }: OPDProps) {
  /**
   * apis
   */
  const { data, error } = useSWR<{
    metrics: {
      [x: string]: DataType;
    };
  }>(
    `/report/patient/metrics?${queryString.stringify({
      date,
      period: 'month',
    })}`
  );

  /**
   * variables
   */
  const metricData = data?.metrics || {};
  const metricKeys = Object.keys(metricData) || [];

  return (
    <div className="overflow-x-auto w-full">
      <table className="w-full border">
        <thead className="divide-y">
          <tr className="divide-x">
            <th rowSpan={3} className="border-r">
              Age Group
            </th>
            <th colSpan={4}>Insured</th>
            <th colSpan={4}>Non-Insured</th>
            <th colSpan={2}></th>
          </tr>
          <tr className="divide-x">
            <th colSpan={2}>New</th>
            <th colSpan={2}>Old</th>
            <th colSpan={2}>New</th>
            <th colSpan={2}>Old</th>
            <th colSpan={2} />
          </tr>
          <tr className="divide-x">
            <th>Male</th>
            <th>Female</th>
            <th>Male</th>
            <th>Female</th>
            <th>Male</th>
            <th>Female</th>
            <th>Male</th>
            <th>Female</th>
            <th>Total Males</th>
            <th>Total Females</th>
          </tr>
        </thead>
        <tbody>
          {!data && !error && <Skeleton.Table count={11} />}
          {metricKeys.map((metricKey, key) => (
            <tr key={key} className="divide-x">
              <td>{metricKey}</td>
              <td className="text-center">
                {metricData[metricKey].insured.new.male}
              </td>
              <td className="text-center">
                {metricData[metricKey].insured.new.female}
              </td>
              <td className="text-center">
                {metricData[metricKey].insured.old.male}
              </td>
              <td className="text-center">
                {metricData[metricKey].insured.old.female}
              </td>
              <td className="text-center">
                {metricData[metricKey].uninsured.new.male}
              </td>
              <td className="text-center">
                {metricData[metricKey].uninsured.new.female}
              </td>
              <td className="text-center">
                {metricData[metricKey].uninsured.old.male}
              </td>
              <td className="text-center">
                {metricData[metricKey].uninsured.old.female}
              </td>
              <td className="text-center">
                {handleSum(metricData[metricKey], 'male')}
              </td>
              <td className="text-center">
                {handleSum(metricData[metricKey], 'female')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const handleSum = (data: DataType, type: 'male' | 'female') => {
  return (
    data?.insured?.old[type] +
    data?.insured?.new[type] +
    data?.uninsured?.old[type] +
    data?.uninsured?.new[type]
  );
};

export default OPD;
