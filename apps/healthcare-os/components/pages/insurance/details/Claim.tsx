import { FieldArray, Form, Formik } from 'formik';
import { Button, Field } from '@healthcareos/react';
import { object } from 'yup';
import { schema } from '@healthcare/utils';
import { toast } from 'react-toastify';

import { insuranceClaimService } from '../../../../services/insurance';
import { InsuranceClaimModel } from '../../../../models';
import SearchSelect from '../../../libs/SearchSelect';

import { InvestigationSelect } from './Claim/Investigation';
import { DiagnosesSelect } from './Claim/Diagnosis';
import { ProcedureSelect } from './Claim/Procedure';
import { MedicineSelect } from './Claim/Medicine';

export interface ClaimProps {
  claim: InsuranceClaimModel;
  mutate: () => void;
  setTab: (key: string) => void;
}

function Claim({ claim, mutate, setTab }: ClaimProps) {
  return (
    <>
      <Formik
        validateOnMount
        enableReinitialize
        validationSchema={object({
          patient: schema.requireString('Patient'),
          visit: schema.requireString('Visit'),

          diagnosis: schema.requireArray('Diagnoses', false).of(
            object().shape({
              id: schema.requireString('Diagnosis'),
              gdrg: object().shape({
                id: schema.requireString('GDRG'),
                name: schema.requireString('Name'),
              }),
            })
          ),

          medicine: schema.requireArray('Medicine', false).of(
            object().shape({
              id: schema.requireString('Medicine'),
              quantity: schema.requireNumber('Quantity'),
              dispense_date: schema.requireString('Dispense date'),
            })
          ),

          procedure: schema.requireArray('Procedure', false).of(
            object().shape({
              id: schema.requireString('Medicine'),
              diagnosis: object().shape({
                id: schema.requireString('Diagnosis'),
              }),
              execution_date: schema.requireString('Dispense date'),
            })
          ),

          investigation: schema.requireArray('Procedure', false).of(
            object().shape({
              id: schema.requireString('Medicine'),
              submitted_at: schema.requireString('Dispense date'),
            })
          ),
          gdrg: object().shape({
            value: schema.requireString('GDRG'),
          }),
          notes: schema.requireString('Notes', false),
        })}
        initialValues={{
          patient: claim?.patient?.id,
          visit: claim?.visit?.id,
          invoice: claim?.visit?.invoices?.map((i) => i.id) || [],

          diagnosis:
            claim?.visit?.diagnoses?.map((i) => ({
              id: i.id,
              name: i.name,
              code: i.code,
              gdrg: { id: i.gdrg?.[0]?.id, name: i.gdrg?.[0]?.name },
            })) || [],

          medicine:
            claim?.visit?.medicines?.map((i) => ({
              id: i.medicine.id,
              name: i.medicine.name,
              quantity: i.quantity,
              dispense_date: i.dispense_date,
              reference: i.reference,
            })) || [],

          procedure:
            claim?.visit?.procedures?.map((i) => ({
              id: i.procedure.id,
              name: i.procedure.name,
              diagnosis: { id: i.diagnosis.id, name: i.diagnosis.name },
              execution_date: i.execution_date,
              reference: i.reference,
            })) || [],

          investigation:
            claim?.visit?.investigations?.map((i) => ({
              id: i.investigation.id,
              name: i.investigation.name,
              submitted_at: i.submitted_at,
              reference: i.reference,
            })) || [],
          notes: '',
          gdrg: { label: '', value: '' },
        }}
        onSubmit={(params, { setSubmitting }) => {
          const data: any = { ...params };

          data.diagnosis = params.diagnosis.map((i) => ({
            id: i.id,
            gdrg: i.gdrg.id,
          }));

          data.medicine = params.medicine.map((i) => ({
            id: i.id,
            quantity: i.quantity,
            dispense_date: i.dispense_date,
            reference: i.reference,
          }));

          data.procedure = params.procedure.map((i) => ({
            id: i.id,
            diagnosis: i.diagnosis.id,
            execution_date: i.execution_date,
            reference: i.reference,
          }));

          data.investigation = params.investigation.map((i) => ({
            id: i.id,
            submitted_at: i.submitted_at,
            reference: i.reference,
          }));

          data.gdrg = params.gdrg.value;

          insuranceClaimService(data)
            .then((response) => {
              mutate();
              toast.success(
                'Claim generated. Kindly check history below to download file'
              );
              setTab('details');
            })
            .catch((error) => toast.error(error?.message))
            .finally(() => setSubmitting(false));
        }}
      >
        {({ values, isValid, isSubmitting, setFieldValue }) => (
          <Form>
            <div className="mb-8">
              {/* Diagnoses */}
              <div className="border border-neutral-200 rounded-lg p-4 mb-6">
                <FieldArray name="diagnosis">
                  {(hp) => (
                    <>
                      <div className="flex items-center justify-between mb-4">
                        <p className="font-bold">Diagnoses</p>
                        <Button
                          type="button"
                          className="!h-8 btn-outline"
                          onClick={() =>
                            hp.push({
                              id: '',
                              name: '',
                              code: '',
                              gdrg: { id: '', name: '' },
                            })
                          }
                        >
                          Add
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 gap-4">
                        {values?.diagnosis?.map((diag, key) => {
                          return (
                            <DiagnosesSelect
                              key={key}
                              index={key}
                              diagnosis={diag}
                              onDelete={() => hp.remove(key)}
                              {...{ setFieldValue }}
                            />
                          );
                        })}
                      </div>
                    </>
                  )}
                </FieldArray>
              </div>

              {/* Medicines */}
              <div className="border border-neutral-200 rounded-lg p-4 mb-6">
                <FieldArray name="medicine">
                  {(hp) => (
                    <>
                      <div className="flex items-center justify-between mb-4">
                        <p className="font-bold">Medicines</p>
                        <Button
                          type="button"
                          className="!h-8 btn-outline"
                          onClick={() =>
                            hp.push({
                              id: '',
                              quantity: '',
                              dispense_date: '',
                              reference: { id: '', name: 'addon' },
                            })
                          }
                        >
                          Add
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 gap-4">
                        {values?.medicine?.map((med, key) => {
                          return (
                            <MedicineSelect
                              key={key}
                              index={key}
                              medicine={med}
                              onDelete={() => hp.remove(key)}
                              {...{ setFieldValue }}
                            />
                          );
                        })}
                      </div>
                    </>
                  )}
                </FieldArray>
              </div>

              {/* Investigations */}
              <div className="border border-neutral-200 rounded-lg p-4 mb-6">
                <FieldArray name="investigation">
                  {(hp) => (
                    <>
                      <div className="flex items-center justify-between mb-4">
                        <p className="font-bold">Investigations</p>
                        <Button
                          type="button"
                          className="!h-8 btn-outline"
                          onClick={() =>
                            hp.push({
                              id: '',
                              name: '',
                              submitted_at: '',
                              reference: { id: '', name: 'addon' },
                            })
                          }
                        >
                          Add
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 gap-4">
                        {values?.investigation?.map((inv, key) => {
                          return (
                            <InvestigationSelect
                              key={key}
                              index={key}
                              investigation={inv}
                              onDelete={() => hp.remove(key)}
                              {...{ setFieldValue }}
                            />
                          );
                        })}
                      </div>
                    </>
                  )}
                </FieldArray>
              </div>

              {/* Procedures */}
              <div className="border border-neutral-200 rounded-lg p-4 mb-6">
                <FieldArray name="procedure">
                  {(hp) => (
                    <>
                      <div className="flex items-center justify-between mb-4">
                        <p className="font-bold">Procedures</p>
                        <Button
                          type="button"
                          className="!h-8 btn-outline"
                          onClick={() =>
                            hp.push({
                              id: '',
                              name: '',
                              diagnosis: { id: '', name: '' },
                              reference: { id: '', name: 'addon' },
                            })
                          }
                        >
                          Add
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 gap-4">
                        {values?.procedure?.map((proc, key) => {
                          return (
                            <ProcedureSelect
                              key={key}
                              index={key}
                              procedure={proc}
                              onDelete={() => hp.remove(key)}
                              {...{ setFieldValue }}
                            />
                          );
                        })}
                      </div>
                    </>
                  )}
                </FieldArray>
              </div>

              {/* <div className="border border-neutral-200 rounded-lg p-4 mb-6">
                <p className="font-bold mb-4">Invoices</p>

                <div className="grid grid-cols-1 gap-4">
                  {claim?.visit?.invoices?.map((i, key) => {
                    return (
                      <Field.Checkbox
                        key={key}
                        checked={values.invoice.includes(i.id)}
                        onChange={({ currentTarget: { checked } }) => {
                          if (checked) {
                            setFieldValue(`invoice`, [...values.invoice, i.id]);
                          } else {
                            setFieldValue(
                              `invoice`,
                              values.invoice.filter((j) => j !== i.id)
                            );
                          }
                        }}
                      >
                        <div>
                          {i.details
                            .map((detail) => detail.description)
                            .join(', ')}
                        </div>
                      </Field.Checkbox>
                    );
                  })}
                </div>
              </div> */}

              <Field.Group name="gdrg" label="Principal GDRG">
                <SearchSelect.GDRG
                  value={values.gdrg}
                  onChange={(value) => setFieldValue('gdrg', value)}
                />
              </Field.Group>

              <Field.Group name="notes" label="Notes">
                <Field.Input
                  name="notes"
                  as="textarea"
                  className="py-4"
                  placeholder="Notes here..."
                />
              </Field.Group>
            </div>
            <div className="modal-footer">
              <Button
                type="submit"
                disabled={!isValid}
                className="btn btn-primary"
                {...{ isSubmitting }}
              >
                Generate claim
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
}

export default Claim;
