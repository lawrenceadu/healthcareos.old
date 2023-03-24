import { ReactElement } from 'react';
import { Confirm } from '@healthcareos/react';

export interface RevokeProps {
  member: any;
  children: ({ proceed }: { proceed: () => void }) => ReactElement;
}

export default function Revoke({ member, children }: RevokeProps) {
  /**
   * functions
   */
  const handleRevoke = () =>
    Confirm({
      header: 'Revoke invite',
      message: (
        <>
          When you revoke this user&apos;s invite they won&apos;t be able to
          join your organization.
        </>
      ),
      buttons: {
        proceed: {
          value: 'Revoke invite',
        },
      },
    }).then((proceed) => {
      if (proceed) {
        return;
      }
    });

  return <>{children({ proceed: handleRevoke })}</>;
}
