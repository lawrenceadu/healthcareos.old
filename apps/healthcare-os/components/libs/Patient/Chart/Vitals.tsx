import { useState } from 'react';
import { AddIcon } from '@healthcare/icons';
import { Button, Field } from '@healthcareos/react';
import queryString from 'query-string';
import useSWR from 'swr';
import dayjs from 'dayjs';

import { usePatient } from '../../../../hooks';
import VitalsForm from '../Vitals';
import Chart from '../../Chart';
import Float from '../../Float';

function Vitals() {
  /**
   * variable
   */
  const format = 'YYYY-MM-DD';

  /**
   * hook
   */
  const { patient } = usePatient();

  /**
   * state
   */
  const [dates, setDates] = useState([
    dayjs().startOf('month').format(format),
    dayjs().endOf('month').format(format),
  ]);

  /**
   * api
   */
  const { data } = useSWR<{
    charts: {
      blood_pressure: {
        date: string;
        value: { diastolic: number; systolic: number };
      }[];
      heart_rate: { date: string; value: number }[];
      oxygen_saturations: { date: string; value: number }[];
      respiratory_rate: { date: string; value: number }[];
      temperature: { date: string; value: number }[];
    };
  }>(
    patient &&
      `/vital/chart?${queryString.stringify({
        patient: patient.id,
        start_date: dates[0],
        end_date: dates[1],
      })}`
  );

  const charts = data?.charts;

  return (
    <>
      <div className="grid gap-6">
        <div className="flex justify-end">
          <Field.Group
            name="date"
            withFormik={false}
            wrapperClassName="w-[350px]"
          >
            <Field.Date
              value={dates}
              options={{ mode: 'range' }}
              placeholder="Select date range"
              setFieldValue={(name, value) => setDates(value as string[])}
            />
          </Field.Group>
        </div>
        <Chart
          title="°C"
          color="#F59E0B"
          header="Temperature (°C)"
          data={
            charts?.temperature?.map((i) => ({
              label: dayjs(i.date).format('MMM DD, h:ma'),
              value: i.value,
            })) || []
          }
        />

        <Chart
          title="bpm"
          color="#B55A72"
          header="Heart rate (bpm)"
          data={
            charts?.heart_rate?.map((i) => ({
              label: dayjs(i.date).format('MMM DD, h:ma'),
              value: i.value,
            })) || []
          }
        />

        <Chart
          header="Blood pressure (mmHg)"
          title={['Diastolic', 'Systolic']}
          color={['#008A97', '#F']}
          data={
            charts?.blood_pressure?.map((i) => ({
              label: dayjs(i.date).format('MMM DD, h:ma'),
              value: [i.value.diastolic, i.value.systolic],
            })) || []
          }
        />

        <Chart
          title="bpm"
          color="#7434A7"
          header="Respiratory rate (bpm)"
          data={
            charts?.respiratory_rate?.map((i) => ({
              label: dayjs(i.date).format('MMM DD, h:ma'),
              value: i.value,
            })) || []
          }
        />

        <Chart
          title="%"
          color="#2D78C6"
          header="Oxygen saturation (%)"
          data={
            charts?.oxygen_saturations?.map((i) => ({
              label: dayjs(i.date).format('MMM DD, h:ma'),
              value: i.value,
            })) || []
          }
        />
      </div>

      <Float>
        <VitalsForm>
          {({ proceed }) => (
            <Button className="btn-primary" onClick={() => proceed()}>
              <AddIcon />
              <span>Add vitals</span>
            </Button>
          )}
        </VitalsForm>
      </Float>
    </>
  );
}

export default Vitals;
