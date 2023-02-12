import { Button, Field } from '@healthcareos/react';
import { Form, Formik } from 'formik';
import { SearchIcon } from '@healthcare/icons';
import { schema } from '@healthcare/utils';
import { object } from 'yup';

import ScanCardComponent from '../../../libs/ScanCard';

export function ScanCard() {
  return (
    <div className="mx-auto md:max-w-[480px] lg:max-w-[528px] w-full">
      <ScanCardComponent
        onSuccess={() => null}
        className="pb-6 mb-6 border-b border-gray-200"
      />

      <div>
        <p className="text-lg font-bold text-center mb-4">
          Find patient by ID number
        </p>

        <Formik
          validateOnMount
          validationSchema={object({
            id_number: schema.requireString('ID Number'),
          })}
          initialValues={{ id_number: '' }}
          onSubmit={(params, { setSubmitting }) => {
            return;
          }}
        >
          {({ values, isValid, isSubmitting }) => (
            <Form>
              <Field.Group name="id_number" label="ID number">
                <Field.Input
                  name="id_number"
                  value={values.id_number}
                  placeholder="Enter ID number"
                />
              </Field.Group>
              <Button
                type="submit"
                disabled={!isValid}
                className="btn btn-primary w-full"
                {...{ isSubmitting }}
              >
                <span>
                  <SearchIcon />
                </span>
                <span>Find patient</span>
              </Button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default ScanCard;
