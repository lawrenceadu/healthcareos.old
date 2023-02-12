import { ButtonHTMLAttributes } from 'react';
import { Dropdown } from '@restart/ui';
import { helpers } from '@healthcare/utils';

export interface ToggleProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  as?: any;
  [x: string]: unknown;
}

export const Toggle = ({
  children,
  className,
  as: Component = 'button',
  ...rest
}: ToggleProps) => {
  return (
    <Dropdown.Toggle>
      {(props) => {
        return (
          <Component
            className={helpers.classNames(className, 'flex items-center')}
            {...rest}
            {...props}
          >
            {children}
          </Component>
        );
      }}
    </Dropdown.Toggle>
  );
};

export default Toggle;
