import { Dispatch, ReactElement, SetStateAction, useState } from 'react';
import { Button, Field, Modal } from '@healthcareos/react';
import { Form, Formik } from 'formik';
import { SearchIcon } from '@healthcare/icons';
import { schema } from '@healthcare/utils';
import { object } from 'yup';

export interface PatientFilterProps {
  filters: any;
  setFilters: Dispatch<SetStateAction<any>>;
  children: (props: { proceed: () => void }) => ReactElement;
}

export function PatientFilter({
  filters,
  setFilters,
  children,
}: PatientFilterProps) {
  /**
   * state
   */
  const [show, setShow] = useState(false);

  /**
   * functions
   */
  const isValid = (values: object): boolean => {
    let isValid = false;

    Object.keys(values).map((key) => {
      if (values[key]) {
        isValid = true;
      }
    });

    return isValid;
  };

  return (
    <>
      {children({ proceed: () => setShow(true) })}
      <Modal show={show} onHide={() => setShow(false)} header="Find patient">
        <Formik
          validateOnMount
          enableReinitialize
          validationSchema={object({
            folder_number: schema.requireString('Folder number', false),
            first_name: schema.requireString('First name', false),
            last_name: schema.requireString('Last name', false),
            middle_name: schema.requireString('Middle name', false),
            dob: schema.requireString('Date of birth', false),
            phone_number: schema.requirePhoneNumber('Phone number', false),
            ghanacard: schema.requireString('ID Number', false),
          })}
          initialValues={{
            folder_number: filters?.folder_number || '',
            first_name: filters?.first_name || '',
            middle_name: filters?.middle_name || '',
            last_name: filters?.last_name || '',
            dob: filters?.dob || '',
            phone_number: filters?.phone_number || '',
            ghanacard: filters?.ghanacard || '',
          }}
          onSubmit={(params, { setSubmitting }) => {
            setFilters((filters) => ({ ...filters, ...params }));
            setShow(false);
          }}
        >
          {({ values, setFieldValue, setFieldTouched }) => (
            <Form>
              <div className="p-6">
                <Field.Group name="folder_number" label="Folder number">
                  <Field.Input
                    name="folder_number"
                    placeholder="Enter the folder number of patient"
                  />
                </Field.Group>

                <Field.Group name="first_name" label="First name">
                  <Field.Input
                    name="first_name"
                    value={values.first_name}
                    placeholder="Enter the first name of patient"
                  />
                </Field.Group>

                <Field.Group name="middle_name" label="Middle name">
                  <Field.Input
                    name="middle_name"
                    value={values.middle_name}
                    placeholder="Enter the middle name(s) of patient"
                  />
                </Field.Group>

                <Field.Group name="last_name" label="Last name">
                  <Field.Input
                    name="last_name"
                    value={values.last_name}
                    placeholder="Enter the last name of patient"
                  />
                </Field.Group>

                <Field.Group name="dob" label="Date of birth">
                  <Field.Date
                    name="dob"
                    value={values.dob}
                    options={{
                      dateFormat: 'd - M - Y',
                    }}
                    {...{ setFieldValue, setFieldTouched }}
                  />
                </Field.Group>

                <Field.Group name="phone_number" label="Phone number">
                  <Field.Phone
                    name="phone_number"
                    value={values.phone_number}
                    {...{ setFieldValue, setFieldTouched }}
                  />
                </Field.Group>

                <Field.Group name="ghanacard" label="Ghana card number">
                  <Field.ID
                    name="ghanacard"
                    value={values.ghanacard}
                    {...{ setFieldValue, setFieldTouched }}
                  />
                </Field.Group>
              </div>

              <div className="modal-footer">
                <Button
                  type="button"
                  className="btn-light"
                  onClick={() => {
                    setFilters(({ page }) => ({ page }));
                    setShow(false);
                  }}
                >
                  Clear
                </Button>
                <Button
                  type="submit"
                  disabled={!isValid(values)}
                  className="btn btn-primary"
                >
                  <span>
                    <SearchIcon />
                  </span>
                  <span>Find patient</span>
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </Modal>
    </>
  );
}

export default PatientFilter;
