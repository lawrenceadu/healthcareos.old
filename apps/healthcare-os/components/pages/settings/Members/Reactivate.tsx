import { ReactElement } from 'react';
import { Confirm } from '@healthcareos/react';

export interface ReactivateProps {
  member: any;
  children: ({ proceed }: { proceed: () => void }) => ReactElement;
}

export default function Reactivate({ member, children }: ReactivateProps) {
  /**
   * functions
   */
  const handleReactivate = () =>
    Confirm({
      header: 'Reactivate invite',
      message: (
        <>
          You are about to reactivate <b>Hilda Quansah</b>. Once they are
          reactivated they will be able to use [platform name goes here].
        </>
      ),
      buttons: {
        proceed: {
          value: 'Reactivate',
        },
      },
    }).then((proceed) => {
      if (proceed) {
        return;
      }
    });

  return <>{children({ proceed: handleReactivate })}</>;
}
