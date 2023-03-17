import useSWR from 'swr/immutable';

import { RoleModel } from '../models';

function useRoles() {
  /**
   * store
   */
  const { data } = useSWR<{ roles: RoleModel[] }>(`/role?per_page=1000`);

  return data?.roles || [];
}

export default useRoles;
