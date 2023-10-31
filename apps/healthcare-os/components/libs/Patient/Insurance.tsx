import { AddIcon, DotsHorizIcon, ShieldPlusIcon } from '@healthcare/icons';
import { startCase } from 'lodash';
import { Badge, Button, Dropdown } from '@healthcareos/react';
import dayjs from 'dayjs';

import { InsuranceModel } from '../../../models';
import { usePatient } from '../../../hooks';
import EditForm from './Insurance/Edit';
import AddForm from './Insurance/Add';
import { helpers } from '@healthcare/utils';

export function Insurance() {
  /**
   * hook
   */
  const { patient, mutate } = usePatient();

  /**
   * variables
   */
  const insurances = patient.insurances;

  return (
    <div>
      {!!insurances?.length && (
        <>
          <div className="flex justify-end mb-6">
            <AddForm>
              {({ proceed }) => (
                <Button className="btn btn-primary" onClick={() => proceed()}>
                  Add new
                </Button>
              )}
            </AddForm>
          </div>

          <div className="overflow-x-auto">
            <table>
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Insurance Name</th>
                  <th>Membership Status</th>
                  <th>Membership Number</th>
                  <th>Expiry date</th>
                  <th>Status</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {insurances.map((insurance, key) => (
                  <EditForm insurance={insurance} key={key}>
                    {({ proceed }) => (
                      <tr>
                        <td>{startCase(insurance.type)}</td>
                        <td>{startCase(insurance.scheme_name) || '--'}</td>
                        <td>
                          {startCase(insurance.membership_status) || '--'}
                        </td>
                        <td>{insurance.membership_number}</td>
                        <td>
                          {dayjs(insurance.expiry_date).format('Do MMM, YYYY')}
                        </td>
                        <td>
                          <Badge
                            variant={
                              helpers.hasExpired(insurance.expiry_date)
                                ? 'danger'
                                : 'success'
                            }
                          >
                            {helpers.hasExpired(insurance.expiry_date)
                              ? 'expired'
                              : 'valid'}
                          </Badge>
                        </td>
                        <td>
                          <Dropdown>
                            <Dropdown.Toggle className="mx-auto">
                              <DotsHorizIcon />
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                              <Dropdown.Item onClick={() => proceed()}>
                                Edit
                              </Dropdown.Item>
                              {/* <Dropdown.Item className="text-red-600">
                                Delete
                              </Dropdown.Item> */}
                            </Dropdown.Menu>
                          </Dropdown>
                        </td>
                      </tr>
                    )}
                  </EditForm>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {!insurances?.length && (
        <div className="max-w-[328px] w-full mx-auto text-center">
          <div className="h-10 w-10 rounded-full bg-gray-100 flex mx-auto mb-4">
            <ShieldPlusIcon variant="solid" className="text-primary m-auto" />
          </div>
          <div className="mb-6">
            <p className="font-bold mb-1">This patient has no insurance</p>
            <p className="text-sm font-medium text-muted">
              You can add an insurance by clicking the add insurance button
              below
            </p>
          </div>
          <AddForm>
            {({ proceed }) => (
              <Button onClick={() => proceed()} className="btn-primary mx-auto">
                <AddIcon />
                <span>Add insurance</span>
              </Button>
            )}
          </AddForm>
        </div>
      )}
    </div>
  );
}

export default Insurance;
