import { HtmlHTMLAttributes, useState } from 'react';
import { ChevronDownIcon, MinusIcon } from '@healthcare/icons';
import { helpers } from '@healthcare/utils';
import { v4 } from 'uuid';
import styled from 'styled-components';

import Button from '../../Button/Button';

// eslint-disable-next-line
export interface ItemProps extends HtmlHTMLAttributes<HTMLElement> {
  header: any;
  actions?: any;
  defaultOpen?: boolean;
  headerClassName?: string;
  contentClassName?: string;
}

export default function Item({
  header,
  actions,
  children,
  className,
  headerClassName,
  contentClassName,
  defaultOpen = false,
  ...props
}: ItemProps) {
  /**
   * variables
   */
  const id = v4();

  /**
   * state
   */
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className={helpers.classNames(className)}>
      <div
        role="button"
        aria-controls={id}
        onClick={() => setOpen(!open)}
        aria-expanded={open ? 'true' : 'false'}
        className={helpers.classNames(
          open && 'mb-2',
          'flex items-center justify-between w-full py-1',
          'select-none'
        )}
      >
        <StyledHead className={helpers.classNames(headerClassName)}>
          {header}
        </StyledHead>
        <div className="flex gap-4">
          {actions}
          <Button
            role="img"
            aria-label={open ? 'close' : 'open'}
            className="!px-0 !h-auto text-muted"
          >
            {open ? <MinusIcon /> : <ChevronDownIcon />}
          </Button>
        </div>
      </div>
      <div
        id={id}
        aria-labelledby={id}
        className={helpers.classNames(
          open ? 'h-auto' : 'h-0',
          'transition-[height] overflow-hidden'
        )}
      >
        {children}
      </div>
    </div>
  );
}

/**
 * styles
 */
const StyledHead = styled.div`
  font-weight: 500;
  font-size: 0.875rem;
`;
