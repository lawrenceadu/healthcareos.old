import { useState } from 'react';
import { Button, Confirm, Field, Modal } from '@healthcareos/react';
import { Form, Formik } from 'formik';
import { schema } from '@healthcare/utils';
import { object } from 'yup';
import { toast } from 'react-toastify';

import { startVisitationService, endVisitationService } from '../../../services/patient'; // prettier-ignore
import { useLocations, usePatient, useCharges } from '../../../hooks';
import { InsuranceModel } from '../../../models';

export interface VisitationProps {
  children: (props: { proceed: () => void }) => void;
}

function Visitation({ children }: VisitationProps) {
  /**
   * state
   */
  const [show, setShow] = useState(false);

  /**
   * hook
   */
  const { patient, mutate, updateHistory } = usePatient();
  const locations = useLocations();
  const charges = useCharges();

  /**
   * variable
   */
  const end = patient.status === 'visiting';

  /**
   * function
   */
  const handleEndVisitation = () =>
    Confirm({
      header: 'End visitation',
      message:
        "You are about to end this patient's visit. Would you like to proceed with this action?",
      buttons: {
        proceed: {
          className: 'btn btn-error',
          value: 'End visitation',
        },
      },
    }).then((proceed) => {
      if (proceed) {
        endVisitationService(patient.id)
          .then(() => {
            mutate();
            setShow(false);
            updateHistory();
            toast.success('Visitation ended');
          })
          .catch((error) =>
            toast.error(error?.message || 'Unable to end visitation')
          );
      }
    });

  const getInsurance = (id: string): InsuranceModel =>
    patient?.insurances?.find((i) => i.id === id);

  return (
    <>
      {children({
        proceed: () => (end ? handleEndVisitation() : setShow(true)),
      })}

      <Modal
        show={show}
        onHide={() => setShow(false)}
        header="Start visitation"
      >
        <Formik
          validateOnMount
          validationSchema={object({
            location: schema.requireString('Location'),
            charges: schema.requireArray('Charges', false),
            insurance: schema.requireString('Insurance', false),
            claim_code: schema
              .requireString('Claim code', false)
              .when('insurance', (insurance, sch) =>
                insurance
                  ? patient.insurances.find((i) => i.id === insurance)
                      ?.scheme_name === 'nhis'
                    ? sch.required('Claim code is required')
                    : sch
                  : sch
              ),
          })}
          initialValues={{
            location: '',
            charges: [],
            insurance: '',
            claim_code: '',
          }}
          onSubmit={(params, { setSubmitting, setErrors }) => {
            startVisitationService({ ...params, patient: patient.id })
              .then(() => {
                mutate();
                toast.success('Visitation started');
                setShow(false);
              })
              .catch(() => setErrors({}))
              .finally(() => setSubmitting(false));
          }}
        >
          {({ values, isValid, isSubmitting, handleSubmit, setFieldValue }) => {
            return (
              <Form>
                <div className="py-10 px-6">
                  <Field.Group
                    name="location"
                    label="Select the location this patient needs to visit *"
                  >
                    <Field.Select
                      name="location"
                      value={values.location}
                      placeholder="Select location"
                      options={locations?.map((i) => ({
                        label: i.name,
                        value: i.id,
                      }))}
                      onChange={({ value }: { value: string }) =>
                        setFieldValue('location', value)
                      }
                    />
                  </Field.Group>

                  <Field.Group name="insurance" label="Select insurance">
                    <Field.Select
                      name="insurance"
                      value={values.insurance}
                      placeholder="Select insurance"
                      onChange={({ value }: { value: string }) => {
                        const ins = getInsurance(value);
                        setFieldValue('insurance', value);

                        if (ins?.type !== 'nhis')
                          setFieldValue('claim_code', '');
                      }}
                      options={
                        patient?.insurances?.map((i) => ({
                          label: `${i.scheme_name} (${i.membership_number})`,
                          value: i.id,
                        })) || []
                      }
                    />
                  </Field.Group>

                  {getInsurance(values.insurance)?.type === 'nhis' && (
                    <Field.Group name="claim_code" label="Claim code *">
                      <Field.Input
                        name="claim_code"
                        placeholder="Enter claim code"
                      />
                    </Field.Group>
                  )}

                  <Field.Group name="charges" label="Charges">
                    <Field.Select
                      isMulti
                      value={values.charges}
                      onChange={(value) =>
                        setFieldValue(
                          'charges',
                          value.map((i) => i.value)
                        )
                      }
                      options={
                        charges?.map((i) => ({ label: i.name, value: i.id })) ||
                        []
                      }
                    />
                  </Field.Group>
                </div>

                <div className="py-3 px-6 flex justify-end gap-6 border-t border-gray-200">
                  <Button
                    type="button"
                    className="btn btn-light"
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
                    Start visitation
                  </Button>
                </div>
              </Form>
            );
          }}
        </Formik>
      </Modal>
    </>
  );
}

export default Visitation;
