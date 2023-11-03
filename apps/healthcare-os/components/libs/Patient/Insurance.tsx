import { AddIcon, DotsHorizIcon, ShieldPlusIcon, SpinnerIcon } from '@healthcare/icons'; // prettier-ignore
import { Badge, Button, Confirm, Dropdown } from '@healthcareos/react';
import { startCase } from 'lodash';
import { helpers } from '@healthcare/utils';
import { toast } from 'react-toastify';
import useSWR from 'swr';
import dayjs from 'dayjs';

import { deleteInsuranceService } from '../../../services/patient';
import { InsuranceModel } from '../../../models';
import { usePatient } from '../../../hooks';
import EditForm from './Insurance/Edit';
import AddForm from './Insurance/Add';

export function Insurance() {
  /**
   * hook
   */
  const { patient, mutate } = usePatient();

  /**
   * api
   */
  const {
    data,
    mutate: insuranceMutate,
    isLoading,
  } = useSWR<{ insurances: InsuranceModel[] }>(
    `/insurance?patient=${patient.id}`
  );

  const insurances = data?.insurances || [];

  /**
   * functions
   */
  const handleDelete = (id: string) =>
    Confirm({
      header: 'Delete Insurance',
      message: 'Are you sure you want to delete this insurance?',
      buttons: { proceed: { value: 'Delete', className: 'btn btn-error' } },
    }).then((proceed) => {
      if (proceed) {
        deleteInsuranceService(id)
          .then(() => {
            toast.success('Deleted');
            insuranceMutate();
            mutate();
          })
          .catch(() => toast.error('Unable to delete'));
      }
    });

  return (
    <div>
      {isLoading && (
        <div className="flex justify-center">
          <SpinnerIcon className="w-10 h-10" />
        </div>
      )}

      {data && (
        <>
          {!!insurances?.length && (
            <>
              <div className="flex justify-end mb-6">
                <AddForm {...{ insuranceMutate }}>
                  {({ proceed }) => (
                    <Button
                      className="btn btn-primary"
                      onClick={() => proceed()}
                    >
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
                      <EditForm key={key} {...{ insurance, insuranceMutate }}>
                        {({ proceed }) => (
                          <tr>
                            <td>{startCase(insurance.type)}</td>
                            <td>{startCase(insurance.scheme_name) || '--'}</td>
                            <td>
                              {startCase(insurance.membership_status) || '--'}
                            </td>
                            <td>{insurance.membership_number}</td>
                            <td>
                              {dayjs(insurance.expiry_date).format(
                                'Do MMM, YYYY'
                              )}
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
                                  <Dropdown.Item
                                    onClick={() => handleDelete(insurance.id)}
                                    className="text-red-600"
                                  >
                                    Delete
                                  </Dropdown.Item>
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
                <ShieldPlusIcon
                  variant="solid"
                  className="text-primary m-auto"
                />
              </div>
              <div className="mb-6">
                <p className="font-bold mb-1">This patient has no insurance</p>
                <p className="text-sm font-medium text-muted">
                  You can add an insurance by clicking the add insurance button
                  below
                </p>
              </div>
              <AddForm {...{ insuranceMutate }}>
                {({ proceed }) => (
                  <Button
                    onClick={() => proceed()}
                    className="btn-primary mx-auto"
                  >
                    <AddIcon />
                    <span>Add insurance</span>
                  </Button>
                )}
              </AddForm>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Insurance;
