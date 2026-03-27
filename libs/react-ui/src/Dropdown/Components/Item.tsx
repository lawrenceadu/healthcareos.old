import DropdownItem, { DropdownItemProps } from '@restart/ui/DropdownItem';
import { helpers } from '@healthcare/utils';
import styled from 'styled-components';

export default function Item({
  active,
  children,
  className,
  ...props
}: DropdownItemProps) {
  return (
    <StyledItem
      className={helpers.classNames(
        'hover:bg-neutral-100 transition',
        active && 'bg-neutral-100',
        className
      )}
      {...props}
    >
      {children}
    </StyledItem>
  );
}

/**
 * styles
 */
const StyledItem = styled(DropdownItem as any)`
  display: flex;
  text-align: left;
  align-items: center;
  font-size: 0.875rem;
  padding: 0.75rem 1rem;
` as any;
