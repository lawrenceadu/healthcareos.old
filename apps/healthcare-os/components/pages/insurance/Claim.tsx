import { ReactNode, useState } from 'react';
import { Form, Formik, FormikHelpers } from 'formik';
import { Button, Field, Modal } from '@healthcareos/react';
import { object, string } from 'yup';
import { schema } from '@healthcare/utils';

import { InsuranceClaimModel } from '../../../models';
import SearchSelect from '../../libs/SearchSelect';

type ValueProps = {
  patient: string;
  visit: string;
  invoice: string[];
  diagnosis: { id: string; gdrg: string }[];
  investigation: string[];
  procedure: string[];
  notes: string;
  gdrg: { label: string; value: string };
};

export interface ClaimProps {
  claim: InsuranceClaimModel;
  children: (props: { proceed: () => void }) => ReactNode;
  onSubmit: (params: ValueProps, actions: FormikHelpers<ValueProps>) => void;
}

function Claim({ claim, children, onSubmit }: ClaimProps) {
  /**
   * state
   */
  const [show, setShow] = useState(false);

  return (
    <>
      {children({ proceed: () => setShow(true) })}

      <Modal show={show} onHide={() => setShow(false)} header="Claim">
        <Formik
          validateOnMount
          validationSchema={object({
            patient: schema.requireString('Patient'),
            visit: schema.requireString('Visit'),
            invoice: schema
              .requireArray('Invoices', false)
              .of(string().required('Invoice is required')),
            diagnosis: schema.requireArray('Diagnoses', false).of(
              object().shape({
                id: schema.requireString('Diagnosis'),
                gdrg: schema.requireString('GDRG'),
              })
            ),
            investigation: schema.requireArray('Investigations', false),
            procedure: schema.requireArray('Procedures', false),
            notes: schema.requireString('Notes', false),
          })}
          initialValues={{
            patient: claim?.patient?.id,
            visit: claim?.visit?.id,
            invoice: claim?.visit?.invoices?.map((i) => i.id) || [],
            diagnosis:
              claim?.visit?.diagnoses?.map((i) => ({
                id: i.id,
                gdrg: i.gdrg?.[0]?.id,
              })) || [],
            procedure: claim?.visit?.procedures?.map((i) => i.id),
            investigation: claim?.visit?.investigations?.map((i) => i.id),
            notes: '',
            gdrg: { label: '', value: '' },
          }}
          onSubmit={onSubmit}
        >
          {({ values, isValid, isSubmitting, setFieldValue }) => (
            <Form>
              <div className="p-6">
                {!!claim.visit.diagnoses.length && (
                  <div className="border border-neutral-200 rounded-lg p-4 mb-6">
                    <p className="font-bold mb-4">Diagnoses</p>

                    <div className="grid grid-cols-1 gap-4">
                      {values?.diagnosis?.map((diag, key) => {
                        const d = claim.visit.diagnoses.find(
                          (i) => i.id === diag.id
                        );

                        return (
                          <div
                            className="grid grid-cols-2 items-center gap-4"
                            key={key}
                          >
                            <div>
                              <p>
                                {d.name} ({d.code})
                              </p>
                            </div>
                            <div>
                              <Field.Group name={`diagnosis.${key}.gdrg`}>
                                <Field.Select
                                  value={diag.gdrg}
                                  placeholder="Select gdrg"
                                  options={(
                                    d.gdrg as { name: string; id: string }[]
                                  ).map((i) => ({
                                    label: i.name,
                                    value: i.id,
                                  }))}
                                />
                              </Field.Group>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {!!claim.visit.investigations.length && (
                  <div className="border border-neutral-200 rounded-lg p-4 mb-6">
                    <p className="font-bold mb-4">Investigations</p>

                    <div className="grid grid-cols-1 gap-4">
                      {claim?.visit?.investigations?.map((i, key) => {
                        return (
                          <Field.Checkbox
                            key={key}
                            checked={values.investigation.includes(i.id)}
                            onChange={({ currentTarget: { checked } }) => {
                              if (checked) {
                                setFieldValue(`investigation`, [
                                  ...values.investigation,
                                  i.id,
                                ]);
                              } else {
                                setFieldValue(
                                  `investigation`,
                                  values.investigation.filter((j) => j !== i.id)
                                );
                              }
                            }}
                          >
                            <div>{i.investigation.name}</div>
                          </Field.Checkbox>
                        );
                      })}
                    </div>
                  </div>
                )}

                {!!claim.visit.procedures.length && (
                  <div className="border border-neutral-200 rounded-lg p-4 mb-6">
                    <p className="font-bold mb-4">Procedures</p>

                    <div className="grid grid-cols-1 gap-4">
                      {claim?.visit?.procedures?.map((i, key) => {
                        return (
                          <Field.Checkbox
                            key={key}
                            checked={values.procedure.includes(i.id)}
                            onChange={({ currentTarget: { checked } }) => {
                              if (checked) {
                                setFieldValue(`procedure`, [
                                  ...values.procedure,
                                  i.id,
                                ]);
                              } else {
                                setFieldValue(
                                  `procedure`,
                                  values.procedure.filter((j) => j !== i.id)
                                );
                              }
                            }}
                          >
                            <div>{i.procedure.name}</div>
                          </Field.Checkbox>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="border border-neutral-200 rounded-lg p-4 mb-6">
                  <p className="font-bold mb-4">Invoices</p>

                  <div className="grid grid-cols-1 gap-4">
                    {claim?.visit?.invoices?.map((i, key) => {
                      return (
                        <Field.Checkbox
                          key={key}
                          checked={values.invoice.includes(i.id)}
                          onChange={({ currentTarget: { checked } }) => {
                            if (checked) {
                              setFieldValue(`invoice`, [
                                ...values.invoice,
                                i.id,
                              ]);
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
                </div>

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
                  type="button"
                  className="btn-light"
                  onClick={() => setShow(false)}
                >
                  Cancel
                </Button>
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
      </Modal>
    </>
  );
}

export default Claim;
