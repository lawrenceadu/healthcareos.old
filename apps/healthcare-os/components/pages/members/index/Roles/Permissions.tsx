import { ReactElement, useState } from 'react';
import { Accordion, Modal } from '@healthcareos/react';
import { Form, Formik } from 'formik';
import { object } from 'yup';
import useSWR from 'swr';

import { RoleModel } from '../../../../../models';
import Module from './Permissions/Module';

export interface PermissionsProps {
  children: (props: { proceed: () => void }) => ReactElement;
  role: RoleModel;
}

function Permissions({ children, role }: PermissionsProps) {
  /**
   * state
   */
  const [show, setShow] = useState(false);

  /**
   * api
   */
  const { data, isLoading } = useSWR<{ role: RoleModel }>(`/role/${role.id}`);

  /**
   * variables
   */
  const permissions =
    data?.role?.permissions?.map((i) => ({
      name: i.name,
      access_level: i.access_level,
    })) || [];

  const items = [
    {
      label: 'Patient',
      modules: [
        { label: 'Patient', value: 'patient' },
        { label: 'Visit', value: 'visit' },
        { label: 'Vitals', value: 'vital' },
        { label: 'Consultation', value: 'consultation' },
        { label: 'Investigation', value: 'investigation' },
        { label: 'Allergy', value: 'allergy' },
        { label: 'Detain / Admin', value: 'admission' },
      ],
    },
    {
      label: 'Inventory',
      modules: [
        { label: 'Inventory', value: 'iteminventory', section: true },
        { label: 'Adjustment', value: 'itemstock' },
        { label: 'Transfer', value: 'itemtransfer' },
        { label: 'Purchase', value: 'itempurchase' },
        { label: 'Item', value: 'item' },
        { label: 'Category', value: 'itemcategory' },
      ],
    },
    {
      label: 'Pharmacy',
      modules: [
        { label: 'Pharmacy', value: 'pharmacy', section: true },
        { label: 'Prescription', value: 'prescription' },
        { label: 'Inventory', value: 'medicineinventory' },
        { label: 'Transfer', value: 'medicinetransfer' },
        { label: 'Purchase', value: 'medicinepurchase' },
        { label: 'Medicine', value: 'medicine' },
        { label: 'Category', value: 'medicinecategory' },
      ],
    },
    {
      label: 'Investigation',
      modules: [
        { label: 'Investigation', value: 'investigation' },
        { label: 'Request', value: 'investigationrequest' },
      ],
    },
    {
      label: 'Queue',
      modules: [{ label: 'Queue', value: 'queue' }],
    },
    {
      label: 'Ward',
      modules: [{ label: 'Ward', value: 'ward' }],
    },
    {
      label: 'Invoice',
      modules: [{ label: 'Invoice', value: 'invoice' }],
    },
    {
      label: 'Resource',
      modules: [
        { label: 'Resource', value: 'resource', section: true },
        { label: 'Department', value: 'department' },
        { label: 'Location', value: 'location' },
        { label: 'Charge', value: 'charge' },
        { label: 'Ward', value: 'ward' },
        { label: 'Investigation', value: 'investigation' },
        { label: 'Supplier', value: 'supplier' },
        { label: 'Institution', value: 'institution' },
        { label: 'Triage', value: 'triage' },
      ],
    },
    {
      label: 'Members',
      modules: [
        { label: 'Members', value: 'user' },
        { label: 'Role', value: 'role' },
        { label: 'Role', value: 'role' },
        { label: 'Permission', value: 'permission' },
      ],
    },
  ];

  return (
    <>
      {children({ proceed: () => setShow(true) })}

      <Modal
        show={show}
        onHide={() => setShow(false)}
        header={`${role.name} Permissions`}
        size="lg"
      >
        <Formik
          validateOnMount
          enableReinitialize
          validationSchema={object({})}
          initialValues={{ permissions }}
          onSubmit={() => {
            return;
          }}
        >
          {({ values, setFieldValue }) => (
            <Form>
              <Accordion className="p-6 grid gap-4">
                {items.map(({ label, modules }, key) => (
                  <Accordion.Item
                    key={key}
                    className="border border-gray-200 p-4 rounded-lg"
                    header={<h4>{label}</h4>}
                  >
                    <Module
                      values={values.permissions}
                      modules={modules}
                      {...{ setFieldValue }}
                    />
                  </Accordion.Item>
                ))}
                {/* <Accordion.Item header="Inventory"></Accordion.Item>
                <Accordion.Item header="Pharmacy"></Accordion.Item>
                <Accordion.Item header="Investigations"></Accordion.Item>
                <Accordion.Item header="Queuing"></Accordion.Item>
                <Accordion.Item header="Wards"></Accordion.Item>
                <Accordion.Item header="Invoices"></Accordion.Item>
                <Accordion.Item header="Resources"></Accordion.Item>
                <Accordion.Item header="Members"></Accordion.Item> */}
              </Accordion>
            </Form>
          )}
        </Formik>
      </Modal>
    </>
  );
}

export default Permissions;
