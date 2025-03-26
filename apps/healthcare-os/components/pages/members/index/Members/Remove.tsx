import { ReactElement } from 'react';
import { Confirm } from '@healthcareos/react';

import { UserModel } from '../../../../../models';
import { deleteMemberService } from '../../../../../services/members';
import { toast } from 'react-toastify';

export interface RemoveProps {
  member: UserModel;
  onSuccess: () => void;
  children: ({ proceed }: { proceed: () => void }) => ReactElement;
}

export default function Remove({ member, onSuccess, children }: RemoveProps) {
  /**
   * functions
   */
  const handleRemove = () =>
    Confirm({
      header: 'Remove member',
      message: (
        <>
          You are about to remove <b>{member.name}</b> from your organization.
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
        deleteMemberService(member.id)
          .then(() => {
            onSuccess();
          })
          .catch((error) => {
            toast.error(error?.message || 'Unable to delete member');
          });
      }
    });

  return <>{children({ proceed: handleRemove })}</>;
}
