import { Fragment } from 'react';
import { Accordion, Badge } from '@healthcareos/react';
import { useRouter } from 'next/router';
import { startCase } from 'lodash';
import useSWR from 'swr';
import dayjs from 'dayjs';

import { usePatient, useStore } from '../../../hooks';
import { AdmissionModel } from '../../../models';

function Overview() {
  /**
   * routes
   */
  const router = useRouter();

  /**
   * store
   */
  const { store } = useStore();

  /**
   * hook
   */
  const { patient } = usePatient();

  /**
   * api
   */
  const { data, error } = useSWR<{ admissions: AdmissionModel[] }>(
    `/admission?patient=${patient.id}`
  );

  /**
   * variables
   */
  const admissions = data?.admissions || [];

  return (
    <>
      <Accordion>
        {!data &&
          !error &&
          Array.from({ length: 2 }, (_, i) => (
            <div key={i} className="rounded-lg bg-neutral-100 h-[200px]" />
          ))}

        {admissions.map((admission, key) => (
          <Accordion.Item
            key={key}
            className="mb-6 border border-gray-200 rounded-lg p-4"
            header={
              <h5 className="text-xl font-bold">
                {admission.type === 'admit' ? 'Admission' : 'Detention'}
              </h5>
            }
            actions={
              <>
                {!admission.end_date ? (
                  <Badge variant="pending">Ongoing</Badge>
                ) : (
                  <Badge variant="success">Discharged</Badge>
                )}
              </>
            }
            {...(!admission.end_date && { defaultOpen: true })}
          >
            <div className="grid gap-4">
              {[
                {
                  label:
                    admission.type === 'admit'
                      ? 'Admission diagnosis'
                      : 'Detention diagnosis',
                  value: admission.diagnoses.map((i) => i.name).join(', '),
                },
                {
                  label:
                    admission.type === 'admit' ? 'Admitted by' : 'Detained by',
                  value: admission.created_by.name,
                },
                {
                  label:
                    admission.type === 'admit'
                      ? 'Admission date'
                      : 'Detention date',
                  value: dayjs(admission.created_at).format('ddd DD, MMM YYYY'),
                },
                { label: 'Department', value: admission.department.name },
                { label: 'Ward', value: admission.ward.name },
                { label: 'Bed', value: admission.bed },
                {
                  label:
                    admission.type === 'admit'
                      ? 'Admission notes'
                      : 'Detention notes',
                  value: admission.notes,
                },
                {
                  label: 'Discharge diagnosis',
                  value: admission.discharge_diagnoses
                    ? admission.discharge_diagnoses
                        .map((i) => i.name)
                        .join(', ')
                    : '',
                },
                {
                  label: 'Discharged by',
                  value: admission.discharged_by?.name,
                },
                {
                  label: 'Discharge date',
                  value: admission.end_date
                    ? dayjs(admission.end_date).format('ddd DD, MMM YYYY')
                    : null,
                },
                {
                  label: 'Outcome',
                  value: startCase(admission?.outcome || ''),
                },
                {
                  label: 'Discharge note',
                  value: admission?.discharge_note,
                },
              ].map((item, key) => (
                <Fragment key={key}>
                  {item.value && (
                    <div key={key} className="font-medium">
                      <small className="block text-muted">{item.label}</small>
                      <p>{item.value}</p>
                    </div>
                  )}
                </Fragment>
              ))}
            </div>
          </Accordion.Item>
        ))}
      </Accordion>
    </>
  );
}

export default Overview;
