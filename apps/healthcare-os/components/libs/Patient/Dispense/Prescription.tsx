import { HtmlHTMLAttributes, useState } from 'react';
import { Accordion, Button, Field, Modal } from '@healthcareos/react';
import { Form, Formik } from 'formik';
import { DeleteIcon } from '@healthcare/icons';
import { helpers } from '@healthcare/utils';
import { object } from 'yup';

// eslint-disable-next-line
export interface PrescriptionProps extends HtmlHTMLAttributes<HTMLDivElement> {}

export function Prescription({ className, ...props }: PrescriptionProps) {
  /**
   * state
   */
  const [toggle, setToggle] = useState(false);

  /**
   * variables
   */
  const items = [
    { label: 'Taken', value: '2 times per day for 5 days as required' },
    { label: 'Single dosage', value: '2 micrograms' },
    { label: 'Dispense until', value: '4 February 2023' },
    { label: 'Prescribed by', value: 'Doctor Quansah 14:47 26/01/2023' },
  ];

  return (
    <>
      <Accordion.Item
        header={<p className="text-lg font-bold">Aspirin 400 mg tablet</p>}
        actions={
          <Field.Checkbox
            checked={toggle}
            withFormik={false}
            title="Check to dispense"
            onChange={({ currentTarget: { checked } }) => setToggle(checked)}
          />
        }
        className={helpers.classNames(className)}
      >
        <div className="flex flex-col">
          {items.map((i, key) => (
            <div className="flex gap-4" key={key}>
              <div className="flex-[0_0_120px]">
                <small className="text-muted text-sm">{i.label}:</small>
              </div>
              <small className="text-sm">{i.value}</small>
            </div>
          ))}
        </div>
      </Accordion.Item>

      {/* modal */}
      <Modal
        show={toggle}
        onHide={() => setToggle(false)}
        header="Dispense drug"
      >
        <Formik
          validateOnMount
          validationSchema={object({})}
          initialValues={{
            dispense_type: 'dispense',
            drug: 'Dexamethasone (0.5 mg/5ml oral liquid)',
            dose: '10',
            dose_unit: 'ml',
          }}
          onSubmit={() => {
            return;
          }}
        >
          {({ values, isValid, isSubmitting, handleSubmit, setFieldValue }) => (
            <Form>
              <div className="p-6">
                <div className="flex gap-6 flex-wrap md:flex-nowrap whitespace-nowrap">
                  <Field.Radio name="dispense_type" value="dispense">
                    Dispense
                  </Field.Radio>
                  <Field.Radio name="dispense_type" value="alternative">
                    Dispense alternative
                  </Field.Radio>
                  <Field.Radio name="dispense_type" value="paper">
                    Paper prescription
                  </Field.Radio>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </Modal>
    </>
  );
}

export default Prescription;
