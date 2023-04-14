import { Fragment } from 'react';
import { Field } from '@healthcareos/react';

export interface ModuleProps {
  values: any;
  modules: { label: string; value: string; section?: boolean }[];
  setFieldValue: (name: string, value: any, shouldValidate?: boolean) => void;
}

function Module({ values, modules, setFieldValue }: ModuleProps) {
  /**
   * variables
   */
  const actions = ['view', 'add', 'edit', 'delete'];

  return (
    <table>
      <thead>
        <tr>
          <th>Module</th>
          <th>View</th>
          <th>Add</th>
          <th>Edit</th>
          <th>Delete</th>
        </tr>
      </thead>
      <tbody>
        {modules.map((module, key) => {
          return (
            <tr key={key}>
              <td>{module.label}</td>
              {actions.map((action, key) => {
                return (
                  <Fragment key={key}>
                    {action === 'view' && module.section && (
                      <td colSpan={4}>
                        <Toggle
                          {...{ values, module, action, setFieldValue }}
                        />
                      </td>
                    )}
                    {!module.section && (
                      <td>
                        <Toggle
                          {...{ values, module, action, setFieldValue }}
                        />
                      </td>
                    )}
                  </Fragment>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

function Toggle({
  values,
  module,
  action,
  setFieldValue,
}: {
  action: string;
  module: ModuleProps['modules'][0];
} & Pick<ModuleProps, 'values' | 'setFieldValue'>) {
  /**
   * variables
   */
  const name = module.section ? module.value : `${module.value}_${action}`;
  const permission = values.find((i) => i.name === name);

  return (
    <Field.Toggle
      name={`permissions`}
      checked={!!permission}
      onChange={(checked) => {
        if (checked) {
          setFieldValue('permissions', [
            ...values,
            { name, access_level: 'all' },
            ...(action === 'view' && !module.section
              ? [{ name: module.value, access_level: 'all' }]
              : []),
          ]);
        } else {
          setFieldValue(
            'permissions',
            values
              .filter((i) => i.name !== name)
              .filter((i) => {
                if (action === 'view') {
                  if (i.name === module.value) {
                    return false;
                  } else {
                    return true;
                  }
                } else {
                  return true;
                }
              })
          );
        }
      }}
    />
  );
}

export default Module;
