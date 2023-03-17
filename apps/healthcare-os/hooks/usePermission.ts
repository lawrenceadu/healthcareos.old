import useStore from './useStore';

function usePermission(key: string) {
  /**
   * store
   */
  const { store } = useStore();

  /**
   * permission
   */
  const perm = store.permissions.find((i) => i.name === key);

  return perm;
}

export default usePermission;
