import { object, string } from 'yup';
import { Button, Field } from '@healthcareos/react';
import { Form, Formik } from 'formik';
import { schema } from '@healthcare/utils';

// type ValueProps = {
//   has_insurance: string;
//   insurance_type: string;
//   nhis_membership_status: string;
//   nhis_membership_number: string;
// };

// export interface InsuranceProps {
//   button?: string;
//   params?: Partial<ValueProps>;
//   onSubmit: (values: ValueProps, actions: FormikHelpers<ValueProps>) => void;
// }

export function Insurance({ header = true, button, params = {}, onSubmit }) {
  /**
   * function
   */
  const handleValidation = (name, type) => {
    return string().when(
      ['has_insurance', 'insurance_type'],
      (has_insurance, insurance_type, sch) => {
        if (has_insurance === 'not_enough') {
          return schema.requireString(name, false, sch);
        }
        if (has_insurance === 'yes' && insurance_type === type) {
          return schema.requireString(name, true, sch);
        }
        return sch;
      }
    );
  };

  return (
    <div className="mx-auto max-w-[528px] w-full">
      <Formik
        validateOnMount
        enableReinitialize
        validationSchema={object({
          has_insurance: schema.requireString('Has insurance'),
          insurance_type: string().when(
            'has_insurance',
            (has_insurance, sch) => {
              return schema.requireString(
                'Insurance type',
                ['yes', 'not_enough'].includes(has_insurance),
                sch
              );
            }
          ),

          // nhis
          nhis_membership_status: handleValidation('Membership status', 'nhis'),
          nhis_membership_number: handleValidation('Membership number', 'nhis'),
          nhis_expiry_date: handleValidation('Expiry date', 'nhis'),
          nhis_claim_code: handleValidation('Claim code', 'nhis'),

          // private
          private_scheme_name: handleValidation('Scheme name', 'private'),
          private_membership_number: handleValidation("Membership number", 'private'), // prettier-ignore
          private_expiry_date: handleValidation('Expiry date', 'private'),
          private_cover_valid: handleValidation('Valid code', 'private'),
        })}
        initialValues={{
          has_insurance: params.has_insurance || '',
          insurance_type: params.insurance_type || '',

          // nhis
          nhis_membership_status: params.nhis_membership_status || '',
          nhis_membership_number: params.nhis_membership_number || '',
          nhis_expiry_date: params.nhis_expiry_date || '',
          nhis_claim_code: params.nhis_claim_code || '',

          // private
          private_scheme_name: params.private_scheme_name || '',
          private_membership_number: params.private_membership_number || '',
          private_expiry_date: params.private_expiry_date || '',
          private_cover_valid: params.private_cover_valid || '',
        }}
        onSubmit={onSubmit}
      >
        {({
          values,
          isValid,
          isSubmitting,
          handleSubmit,
          setFieldValue,
          setFieldTouched,
        }) => (
          <Form>
            {header && <h4 className="mb-4">Insurance details</h4>}

            <div className="mb-10">
              {!params?.has_insurance && (
                <div className="mb-6">
                  <p className="mb-4">Does patient have insurance</p>
                  <div className="flex gap-6">
                    <Field.Radio name="has_insurance" value="yes">
                      Yes
                    </Field.Radio>
                    <Field.Radio name="has_insurance" value="no">
                      No
                    </Field.Radio>
                    <Field.Radio name="has_insurance" value="not_enough">
                      Not enough information
                    </Field.Radio>
                  </div>
                </div>
              )}

              {['yes', 'not_enough'].includes(values.has_insurance) && (
                <>
                  <div className="mb-6">
                    <p className="mb-4">Select patient&apos;s insurance</p>
                    <div className="flex gap-6">
                      <Field.Radio name="insurance_type" value="nhis">
                        NHIS
                      </Field.Radio>
                      <Field.Radio name="insurance_type" value="private">
                        Private
                      </Field.Radio>
                    </div>
                  </div>

                  {/* NHIS */}
                  {values.insurance_type === 'nhis' && (
                    <>
                      <div className="mb-6">
                        <p className="mb-4">Membership status</p>
                        <div className="flex gap-6">
                          <Field.Radio
                            name="nhis_membership_status"
                            value="member"
                          >
                            Member
                          </Field.Radio>
                          <Field.Radio
                            name="nhis_membership_status"
                            value="dependant"
                          >
                            {`Dependant (< 3months old)`}
                          </Field.Radio>
                        </div>
                      </div>

                      <Field.Group
                        name="nhis_membership_number"
                        label="Membership number"
                      >
                        <Field.Input
                          name="nhis_membership_number"
                          value={values.nhis_membership_number}
                          placeholder="Enter membership number"
                        />
                      </Field.Group>

                      <Field.Group name="nhis_expiry_date" label="Expiry date">
                        <Field.Date
                          name="nhis_expiry_date"
                          value={values.nhis_expiry_date}
                          {...{ setFieldValue, setFieldTouched }}
                        />
                      </Field.Group>

                      <div className="flex gap-6">
                        <Field.Group
                          name="nhis_claim_code"
                          label="Claim check code"
                          wrapperClassName="w-full !mb-0"
                        >
                          <Field.Input
                            name="nhis_claim_code"
                            value={values.nhis_claim_code}
                            placeholder="Enter claim check code"
                          />
                        </Field.Group>

                        <div className="mt-6">
                          <Button type="button" className="btn btn-outline">
                            Get claim code
                          </Button>
                        </div>
                      </div>
                    </>
                  )}

                  {/* PRIVATE */}
                  {values.insurance_type === 'private' && (
                    <>
                      <Field.Group
                        name="private_scheme_name"
                        label="Scheme name"
                      >
                        <Field.Input
                          name="private_scheme_name"
                          value={values.private_scheme_name}
                          placeholder="Enter name of insurance scheme"
                        />
                      </Field.Group>

                      <Field.Group
                        name="private_membership_number"
                        label="Membership number"
                      >
                        <Field.Input
                          name="private_membership_number"
                          value={values.private_membership_number}
                          placeholder="Enter membership number"
                        />
                      </Field.Group>

                      <Field.Group
                        name="private_expiry_date"
                        label="Expiry date"
                      >
                        <Field.Date
                          name="private_expiry_date"
                          value={values.private_expiry_date}
                          {...{ setFieldValue, setFieldTouched }}
                        />
                      </Field.Group>

                      <div>
                        <p className="mb-4">Is this insurance cover valid?</p>
                        <div className="flex gap-6">
                          <Field.Radio name="private_cover_valid" value="yes">
                            Yes
                          </Field.Radio>
                          <Field.Radio name="private_cover_valid" value="noe">
                            No
                          </Field.Radio>
                        </div>
                      </div>
                    </>
                  )}
                </>
              )}
            </div>

            <Button
              type="submit"
              disabled={!isValid}
              onClick={() => handleSubmit()}
              className="w-full btn btn-primary"
              {...{ isSubmitting }}
            >
              {button}
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default Insurance;
