import { useState } from 'react';
import { Accordion, Badge, Button, Field } from '@healthcareos/react';
import { helpers } from '@healthcare/utils';
import queryString from 'query-string';
import useSWR from 'swr';
import dayjs from 'dayjs';

import { MedicineModel, PrescriptionModel } from '../../../models';
import { usePatient } from '../../../hooks';
import Float from '../Float';
import Administer from './DrugChart/Administer';

function DrugChart() {
  /**
   * variables
   */
  const format = 'YYYY/MM/DD';

  /**
   * state
   */
  const [dates, setDates] = useState([
    dayjs().startOf('day').format(format),
    dayjs().endOf('day').format(format),
  ]);

  /**
   * hooks
   */
  const { patient } = usePatient();

  /**
   * api
   */
  const { data, mutate, isLoading } = useSWR<{ chart: any }>(
    `/prescription/chart?${queryString.stringify({
      patient: patient.id,
      start_date: dates[0],
      end_date: dates[1],
    })}`
  );

  const prescriptions = data?.chart
    ? (Object.entries(data.chart) as [
        string,
        (Omit<PrescriptionModel['medicines'][0], 'medicine'> & {
          medicine: MedicineModel;
        })[]
      ][])
    : [];

  return (
    <div>
      <div className="flex justify-end mb-6">
        <Field.Group
          name="date"
          withFormik={false}
          wrapperClassName="max-w-[320px] w-full"
        >
          <Field.Date
            value={dates}
            options={{ mode: 'range' }}
            setFieldValue={(name, value) => setDates(value as string[])}
          />
        </Field.Group>
      </div>

      <Accordion className="flex flex-col gap-4">
        {isLoading &&
          Array.from({ length: 3 }, (_, i) => (
            <div
              key={i}
              className="h-[96px] rounded-lg bg-neutral-200 animate-pulse"
            />
          ))}

        {prescriptions.map((i, key) => {
          const date = i[0];
          const prescriptions = i[1];

          return (
            <Accordion.Item
              key={key}
              className="rounded-lg p-4 border border-gray-200"
              header={
                <p className="text-lg font-bold">
                  {dayjs(date).format('DD MMM YYYY')}
                </p>
              }
            >
              {prescriptions.map((prescription, key) => {
                return (
                  <div
                    key={key}
                    className={helpers.classNames(
                      key !== prescriptions.length - 1 &&
                        'mb-2 pb-2 border-b border-neutral-200'
                    )}
                  >
                    <div className="flex gap-2 justify-between items-end font-medium">
                      <div>
                        {!!prescription.administration_time?.length && (
                          <p className="text-xs text-gray-600">
                            {prescription.administration_time.join(', ')}
                          </p>
                        )}
                        <p className="text-sm font-bold">
                          {prescription.medicine.name}
                        </p>
                      </div>
                      <span>
                        <Badge variant={prescription.schedule}>
                          {prescription.schedule}
                        </Badge>
                      </span>
                    </div>
                  </div>
                );
              })}
            </Accordion.Item>
          );
        })}
      </Accordion>

      {/* float */}
      <Float>
        <Administer {...{ mutate }}>
          {({ proceed }) => (
            <Button className="btn-primary" onClick={() => proceed()}>
              Administer drug
            </Button>
          )}
        </Administer>
      </Float>
    </div>
  );
}

export default DrugChart;
