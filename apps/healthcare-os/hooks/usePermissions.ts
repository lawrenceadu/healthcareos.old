import useStore from './useStore';

function usePermissions(...keys): boolean[] {
  const { store } = useStore();

  const perms = keys.map(
    (key) =>
      !!store?.permissions?.find(
        (i) =>
          i.name.toLowerCase() === key.toLowerCase() && i.access_level === 'all'
      )
  );

  return perms;
}

export default usePermissions;
