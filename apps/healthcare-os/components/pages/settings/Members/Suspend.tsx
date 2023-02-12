import { ReactElement } from 'react';
import { Confirm } from '@healthcareos/react';

export interface SuspendProps {
  member: any;
  children: ({ proceed }: { proceed: () => void }) => ReactElement;
}

export default function Suspend({ member, children }: SuspendProps) {
  /**
   * functions
   */
  const handleSuspend = () =>
    Confirm({
      header: 'Suspend member',
      message: (
        <>
          You are about to suspend <b>Hilda Quansah</b>. They won&apos;t be able
          to perform any action until you reactivate their account.
        </>
      ),
      buttons: {
        proceed: {
          value: 'Suspend',
          className: 'btn bg-red-600 text-white',
        },
      },
    }).then((proceed) => {
      if (proceed) {
        return;
      }
    });

  return <>{children({ proceed: handleSuspend })}</>;
}
