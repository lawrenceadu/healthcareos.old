import { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon, DotsHorizIcon } from '@healthcare/icons'; // prettier-ignore
import { Badge, Confirm, Dropdown } from '@healthcareos/react';
import { startCase } from 'lodash';
import { helpers } from '@healthcare/utils';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';

import { ItemIssueModel } from '../../../../../models';
import { useStore } from '../../../../../hooks';
import * as api from '../../../../../services/inventory';
import Form from './Form';

export interface TableRowProps {
  issue: ItemIssueModel;
  mutate: () => void;
}

function TableRow({ issue, mutate }: TableRowProps) {
  /**
   * state
   */
  const [toggle, setToggle] = useState(false);

  /**
   * store
   */
  const { store } = useStore();

  /**
   * function
   */
  const handleDelete = () =>
    Confirm({
      header: 'Delete stock',
      message: (
        <>
          You are about to delete this stock? Once you delete it you will lose
          it forever.
        </>
      ),
      buttons: {
        proceed: {
          value: 'Delete stock',
        },
      },
    }).then((proceed) => {
      if (proceed) {
        return;
      }
    });

  const handleStatusUpdate = (status: ItemIssueModel['status']) =>
    Confirm({
      header: 'Update status',
      message: (
        <>
          Are you sure you want to mark this stock as <b>{status}</b>?
        </>
      ),
      buttons: {
        proceed: { className: 'btn-primary' },
      },
    }).then((proceed) => {
      if (proceed) {
        return;
      }
    });

  return (
    <>
      <tr
        className={helpers.classNames('cursor-pointer', toggle && 'bg-gray-50')}
        onClick={() => setToggle(!toggle)}
      >
        <td>
          <div className="flex gap-2 items-center">
            {toggle ? (
              <ChevronUpIcon size={20} />
            ) : (
              <ChevronDownIcon size={20} />
            )}
            <span>{issue.created_by.name || '--'}</span>
          </div>
        </td>
        <td>{issue?.location?.name || '--'}</td>
        <td>
          <div>
            <p>{issue.recipient.name}</p>
            <small className="text-gray-600">{startCase(issue.issue_to)}</small>
          </div>
        </td>
        <td>
          <Badge variant={issue.status}>{issue.status}</Badge>
        </td>
        <td onClick={(e) => e.stopPropagation()}>
          <Dropdown>
            <Dropdown.Toggle className="mx-auto">
              <DotsHorizIcon />
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Form params={issue} {...{ mutate }}>
                {({ proceed }) => (
                  <Dropdown.Item onClick={() => proceed()}>
                    Update
                  </Dropdown.Item>
                )}
              </Form>
            </Dropdown.Menu>
          </Dropdown>
        </td>
      </tr>

      {toggle && (
        <>
          <tr>
            <td colSpan={9} className="!p-0">
              <table>
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {issue.details.map((detail, key) => (
                    <tr key={key}>
                      <td>{detail.item.name}</td>
                      <td>{detail.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </td>
          </tr>

          {issue.notes && (
            <tr>
              <td colSpan={8} className="!whitespace-normal">
                <p className="font-medium">Notes:</p>
                <p>{issue.notes}</p>
              </td>
            </tr>
          )}
        </>
      )}
    </>
  );
}

export default TableRow;
