import { Form, Formik, FormikHelpers } from 'formik';
import { object, string } from 'yup';
import { Button, Field } from '@healthcareos/react';
import { schema } from '@healthcare/utils';

type ValueProps = {
  has_insurance: string;
  insurance_type: string;
  insurance_membership_status: string;
  insurance_membership_number: string;
  insurance_expiry_date: string;
  insurance_scheme_name: string;
  insurance_claim_code: string;
};

export interface InsuranceProps {
  button?: string;
  header?: boolean;
  params?: Partial<ValueProps>;
  withInsuranceSelect?: boolean;
  onSubmit: (values: ValueProps, actions: FormikHelpers<ValueProps>) => void;
}

export function Insurance({
  header = true,
  button,
  params = {},
  onSubmit,
  withInsuranceSelect = true,
}: InsuranceProps) {
  /**
   * function
   */
  const handleValidation = (name) => {
    return string().when('has_insurance', (has_insurance, sch) => {
      if (has_insurance === 'not_enough') {
        return schema.requireString(name, false, sch);
      }
      if (has_insurance === 'yes') {
        return schema.requireString(name, true, sch);
      }
      return sch;
    });
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

          insurance_membership_number: handleValidation('Membership number'),
          insurance_expiry_date: handleValidation('Expiry date'),

          // private
          insurance_scheme_name: string().when(
            'insurance_type',
            (insurance_type, sch) =>
              insurance_type === 'private'
                ? schema.requireString('Scheme name', true, sch)
                : sch
          ),
          // nhis
          insurance_membership_status: string().when(
            'insurance_type',
            (insurance_type, sch) =>
              insurance_type === 'nhis'
                ? schema.requireString('Membership status', true, sch)
                : sch
          ),
        })}
        initialValues={{
          has_insurance: params.has_insurance || '',
          insurance_type: params.insurance_type || '',
          insurance_membership_status: params.insurance_membership_status || '',
          insurance_membership_number: params.insurance_membership_number || '',
          insurance_expiry_date: params.insurance_expiry_date || '',
          insurance_scheme_name: params.insurance_scheme_name || '',
        }}
        onSubmit={(params, actions) =>
          onSubmit({ ...params, insurance_claim_code: '1' }, actions)
        }
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
              {withInsuranceSelect && (
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

                  {values.insurance_type === 'nhis' && (
                    <div className="mb-6">
                      <p className="mb-4">Membership status</p>
                      <div className="flex gap-6">
                        <Field.Radio
                          name="insurance_membership_status"
                          value="member"
                        >
                          Member
                        </Field.Radio>
                        <Field.Radio
                          name="insurance_membership_status"
                          value="dependant"
                        >
                          {`Dependant (< 3months old)`}
                        </Field.Radio>
                      </div>
                    </div>
                  )}

                  {values.insurance_type === 'private' && (
                    <Field.Group
                      name="insurance_scheme_name"
                      label="Scheme name"
                    >
                      <Field.Input
                        name="insurance_scheme_name"
                        value={values.insurance_scheme_name}
                        placeholder="Enter name of insurance scheme"
                      />
                    </Field.Group>
                  )}

                  <Field.Group
                    name="insurance_membership_number"
                    label="Membership number"
                  >
                    <Field.Input
                      name="insurance_membership_number"
                      value={values.insurance_membership_number}
                      placeholder="Enter membership number"
                    />
                  </Field.Group>

                  <Field.Group name="insurance_expiry_date" label="Expiry date">
                    <Field.Date
                      name="insurance_expiry_date"
                      value={values.insurance_expiry_date}
                      {...{ setFieldValue, setFieldTouched }}
                    />
                  </Field.Group>
                </>
              )}
            </div>

            <Button
              type="submit"
              disabled={!isValid}
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
