import { useLayoutEffect } from 'react';
import { UseDropdownMenuOptions, useDropdownMenu } from '@restart/ui';
import { helpers } from '@healthcare/utils';
import { motion } from 'framer-motion';
import styled from 'styled-components';

export interface MenuProps extends UseDropdownMenuOptions {
  className?: string;
  role?: string;
  children?: any;
}

export const Menu = ({ role, className, children, ...rest }: MenuProps) => {
  const [props, { toggle, show, popper }] = useDropdownMenu({
    flip: true,
    fixed: true,
    offset: [0, 8],
    placement: 'bottom-start',
    ...rest,
  });

  useLayoutEffect(() => {
    if (show) popper?.update();
  }, [show]);

  return (
    <StyledMenu
      {...props}
      role={role}
      transition={{ duration: 0.15 }}
      initial={{ opacity: 0, height: 0 }}
      animate={{
        opacity: show ? 1 : 0,
        height: show ? 'auto' : 0,
      }}
      className={helpers.classNames(
        'shadow-3xl !bg-white !z-[5]',
        'flex',
        className
      )}
    >
      {children}
    </StyledMenu>
  );
};

/**
 * styles
 */
const StyledMenu = styled(motion.div)`
  display: flex;
  overflow: auto;
  min-width: 240px;
  border-radius: 0.5rem;
  background-color: #fff;
  flex-direction: column;
  border: solid 1px var(--color-neutral-200);
`;

export default Menu;
