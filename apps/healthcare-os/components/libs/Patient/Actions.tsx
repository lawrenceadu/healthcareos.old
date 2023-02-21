import { HtmlHTMLAttributes } from 'react';
import { ChevronDownIcon, UserEditIcon } from '@healthcare/icons';
import { Button, Dropdown } from '@healthcareos/react';
import { useRouter } from 'next/router';
import { helpers } from '@healthcare/utils';

import DetainForm from './Detain';
import AdmitForm from './Admit';
import routes from '../../../routes';

// eslint-disable-next-line
export interface ActionsProps extends HtmlHTMLAttributes<HTMLDivElement> {}

export function Actions({ className }: ActionsProps) {
  /**
   * routes
   */
  const router = useRouter();
  const id = router.query.id as string;

  return (
    <div
      className={helpers.classNames(
        'bg-gray-50 p-6 grid grid-cols-2 gap-2',
        className
      )}
    >
      <Button
        className="btn-outline w-full"
        onClick={() =>
          router.push({
            pathname: routes.dashboard.patients.details.edit,
            query: { id },
          })
        }
      >
        <UserEditIcon />
        <span>Edit profile</span>
      </Button>
      <Dropdown className="w-full">
        <Dropdown.Toggle as={Button} className="w-full btn-secondary">
          <span>Other actions</span>
          <ChevronDownIcon />
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item>Re-issue card</Dropdown.Item>
          <Dropdown.Item>Re-issue PIN</Dropdown.Item>
          <DetainForm>
            {({ proceed }) => (
              <Dropdown.Item onClick={() => proceed()}>
                Detain patient
              </Dropdown.Item>
            )}
          </DetainForm>
          <AdmitForm>
            {({ proceed }) => (
              <Dropdown.Item onClick={() => proceed()}>
                Admit patient
              </Dropdown.Item>
            )}
          </AdmitForm>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
}

export default Actions;
