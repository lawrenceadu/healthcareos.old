import { Accordion, Button, Dropdown, Field } from '@healthcareos/react';
import { ChevronDownIcon } from '@healthcare/icons';
import { useRouter } from 'next/router';

import DischargeForm from './Discharge';
import AdmitForm from './Admit';
import routes from '../../../routes';

function Overview() {
  /**
   * routes
   */
  const router = useRouter();

  /**
   * variables
   */
  const invoiceUrl = routes.dashboard.patients.details.index
    .replace('[id]', String(router.query.id))
    .replace('[tab]', 'invoice');

  return (
    <>
      <Accordion>
        <Accordion.Item
          defaultOpen
          className="mb-6"
          header={<h5 className="text-xl font-bold">Detention</h5>}
        >
          <div className="px-4">
            <div className="mb-10">
              <Field.Group
                name="date"
                label="Detention date"
                withFormik={false}
              >
                <Field.Date
                  name="date"
                  value="2022/11/22"
                  setFieldValue={() => null}
                />
              </Field.Group>

              <Field.Group name="ward" label="Ward" withFormik={false}>
                <Field.Select
                  name="ward"
                  value="female_ward"
                  options={[{ label: 'Female ward', value: 'female_ward' }]}
                />
              </Field.Group>

              <Field.Group
                name="department"
                label="Department"
                withFormik={false}
              >
                <Field.Select
                  name="department"
                  value="medical"
                  options={[{ label: 'Medial', value: 'medical' }]}
                />
              </Field.Group>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button
                className="btn-light w-full"
                onClick={() => router.push(invoiceUrl)}
              >
                Patient invoice
              </Button>
              <Dropdown>
                <Dropdown.Toggle as={Button} className="btn-primary w-full">
                  <span>Action</span>
                  <ChevronDownIcon />
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <AdmitForm>
                    {({ proceed }) => (
                      <Dropdown.Item onClick={() => proceed()}>
                        Admit patient
                      </Dropdown.Item>
                    )}
                  </AdmitForm>

                  <DischargeForm>
                    {({ proceed }) => (
                      <Dropdown.Item onClick={() => proceed()}>
                        Discharge patient
                      </Dropdown.Item>
                    )}
                  </DischargeForm>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
        </Accordion.Item>

        <Accordion.Item
          defaultOpen
          header={<h5 className="text-xl font-bold">Admission</h5>}
        >
          <div className="px-4">
            <div className="mb-10">
              <Field.Group
                name="diagnosis"
                label="Admission diagnosis"
                withFormik={false}
              >
                <Field.Input
                  name="diagnosis"
                  value="Mild malaria"
                  withFormik={false}
                />
              </Field.Group>

              <Field.Group
                name="admitted_by"
                label="Admited by"
                withFormik={false}
              >
                <Field.Input
                  name="admitted_by"
                  value="Doctor Francis"
                  withFormik={false}
                />
              </Field.Group>

              <Field.Group
                name="date"
                label="Detention date"
                withFormik={false}
              >
                <Field.Date
                  name="date"
                  value="2022/11/22"
                  setFieldValue={() => null}
                />
              </Field.Group>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button
                className="btn-light w-full"
                onClick={() => router.push(invoiceUrl)}
              >
                Patient invoice
              </Button>
              <DischargeForm>
                {({ proceed }) => (
                  <Button
                    onClick={() => proceed()}
                    className="btn-primary w-full"
                  >
                    Discharge
                  </Button>
                )}
              </DischargeForm>
            </div>
          </div>
        </Accordion.Item>
      </Accordion>
    </>
  );
}

export default Overview;
