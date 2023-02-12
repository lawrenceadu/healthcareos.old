import { ReactElement } from 'react';
import { Confirm } from '@healthcareos/react';

export interface RemoveProps {
  member: any;
  children: ({ proceed }: { proceed: () => void }) => ReactElement;
}

export default function Remove({ member, children }: RemoveProps) {
  /**
   * functions
   */
  const handleRemove = () =>
    Confirm({
      header: 'Remove member',
      message: (
        <>
          You are about to remove <b>Hilda Quansah</b> from your organization.
        </>
      ),
      buttons: {
        proceed: {
          value: 'Remove',
          className: 'btn bg-red-600 text-white',
        },
      },
    }).then((proceed) => {
      if (proceed) {
        return;
      }
    });

  return <>{children({ proceed: handleRemove })}</>;
}
