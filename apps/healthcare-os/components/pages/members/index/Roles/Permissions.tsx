import { ReactElement, useState } from 'react';
import { Accordion, Button, Modal } from '@healthcareos/react';
import { Form, Formik } from 'formik';
import { toast } from 'react-toastify';
import useSWR from 'swr';

import { updateRolePermissionService } from '../../../../../services/members';
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
  const { data, mutate } = useSWR<{ role: RoleModel }>(
    show && `/role/${role.id}`
  );

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
        { label: 'Allergy', value: 'allergy' },
        { label: 'Detain / Admit', value: 'admission' },
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
        { label: 'Dispense', value: 'dispense' },
        { label: 'Inventory', value: 'pharmacyinventory', section: true },
        { label: 'Transfer', value: 'medicinetransfer' },
        { label: 'Purchase', value: 'medicinepurchase' },
        { label: 'Medicine', value: 'medicine' },
        { label: 'Category', value: 'medicinecategory' },
      ],
    },
    {
      label: 'Investigation',
      modules: [{ label: 'Request', value: 'investigationrequest' }],
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
        { label: 'Permission', value: 'permission' },
      ],
    },
  ];

  return (
    <>
      {children({ proceed: () => setShow(true) })}

      <Modal
        size="lg"
        show={show}
        onHide={() => setShow(false)}
        header={`${role.name} Permissions`}
      >
        <Formik
          enableReinitialize
          initialValues={{ permissions }}
          onSubmit={(params, { setSubmitting }) => {
            updateRolePermissionService(params, role.id)
              .then(() => {
                mutate();
                toast.success('Permissions updated');
                setShow(false);
              })
              .catch((error) => {
                toast.error(error?.message || 'Unable to update permission');
              })
              .finally(() => setSubmitting(false));
          }}
        >
          {({ values, isValid, isSubmitting, setFieldValue }) => (
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
              </Accordion>
              <div className="modal-footer">
                <Button
                  type="button"
                  onClick={() => setShow(false)}
                  className="btn-light"
                >
                  Cancel
                </Button>
                <Button
                  disabled={!isValid}
                  className="btn btn-primary"
                  {...{ isSubmitting }}
                >
                  Update permission
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </Modal>
    </>
  );
}

export default Permissions;
