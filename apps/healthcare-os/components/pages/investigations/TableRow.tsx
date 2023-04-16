import { useState } from 'react';
import { Badge, Dropdown, Modal } from '@healthcareos/react';
import { DotsHorizIcon } from '@healthcare/icons';
import { useRouter } from 'next/router';
import dayjs from 'dayjs';

import { InvestigationRequestModel } from '../../../models';
import { usePermissions } from '../../../hooks';
import Patient from '../../libs/Patient';
import routes from '../../../routes';

export interface TableRowProps {
  investigation: InvestigationRequestModel;
  mutate: () => void;
}

function TableRow({ investigation, mutate }: TableRowProps) {
  /**
   * state
   */
  const [show, setShow] = useState(false);

  /**
   * perm
   */
  const [canEdit] = usePermissions('investigationrequest_edit');

  /**
   * routes
   */
  const router = useRouter();

  return (
    <>
      <tr role="button" onClick={() => setShow(true)}>
        <td>{investigation.investigation.name}</td>
        <td>
          {investigation.expected_date
            ? dayjs(investigation.expected_date).format('ddd DD, MMM YYYY')
            : '--'}
        </td>
        <td>{investigation.created_by.name}</td>
        <td>{dayjs(investigation.created_at).format('DD/MM/YYYY')}</td>
        <td>{investigation?.patient?.name || '--'}</td>
        <td>
          <Badge variant={investigation.status}>{investigation.status}</Badge>
        </td>
        <td onClick={(e) => e.stopPropagation()}>
          <Dropdown>
            <Dropdown.Toggle className="mx-auto">
              <DotsHorizIcon />
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => setShow(true)}>View</Dropdown.Item>

              <Dropdown.Item
                onClick={() =>
                  router.push(
                    routes.dashboard.patients.details.index
                      .replace('[id]', investigation.patient.id)
                      .replace('[tab]', 'history')
                  )
                }
              >
                View patient
              </Dropdown.Item>

              {canEdit && investigation.status === 'pending' && (
                <Patient.Investigations.Submit
                  investigation={investigation}
                  mutate={mutate}
                >
                  {({ proceed }) => (
                    <Dropdown.Item onClick={() => proceed()}>
                      Submit results
                    </Dropdown.Item>
                  )}
                </Patient.Investigations.Submit>
              )}
            </Dropdown.Menu>
          </Dropdown>
        </td>
      </tr>

      <Modal
        show={show}
        onHide={() => setShow(false)}
        header="Investigation details"
      >
        <Patient.Investigations.Investigation
          mutate={() => {
            mutate();
            setShow(false);
          }}
          className="!border-none"
          investigation={investigation}
        />
      </Modal>
    </>
  );
}

export default TableRow;
